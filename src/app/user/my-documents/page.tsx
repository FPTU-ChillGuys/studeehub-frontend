"use client";

import Link from "next/link";
import {
  BookOpen,
  Search,
  MoreVertical,
  Grid,
  List,
  Plus,
  FileText,
  MessageCircle,
  Calendar,
  Edit,
  Trash2,
} from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Notebook } from "@/Types";
import CreateNotebookModal from "@/components/modals/CreateNotebookModal";
import useStateRef from "react-usestateref";
import { useEffect } from "react";

// Helper function to format date in a user-friendly way
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // Just now (< 1 minute)
  if (diffInSeconds < 60) {
    return "Just now";
  }
  
  // Minutes ago (< 1 hour)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  // Hours ago (< 24 hours)
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  // Days ago (< 7 days)
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
  
  // Weeks ago (< 30 days)
  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  }
  
  // Months ago (< 365 days)
  if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }
  
  // Years ago
  const years = Math.floor(diffInDays / 365);
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
};

// Helper function to format date to readable date string (DD/MM/YYYY)
const formatDateToString = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const NotebooksPage = () => {
  const [searchTerm, setSearchTerm] = useStateRef("");
  const [viewMode, setViewMode] = useStateRef<"grid" | "list">("grid");
  const [filterStatus, setFilterStatus] = useStateRef<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useStateRef(false);
  const [editingNotebook, setEditingNotebook] = useStateRef<string | null>(
    null
  );
  const [editTitle, setEditTitle] = useStateRef("");
  const [openDropdown, setOpenDropdown] = useStateRef<string | null>(null);

  //Get userId from localStorage
  const [userId, setUserId, userIdRef] = useStateRef<string | null>(null);

  // Sample notebooks data
  const [notebooks, setNotebooks] = useStateRef<Notebook[]>([]);

  //Get userId from localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userObj = JSON.parse(user);
      setUserId(userObj.id);
    }
    console.log("User ID:", userIdRef.current);
  }, [setUserId, userIdRef]);

  // Fetch notebooks from the server
  useEffect(() => {
    const fetchNotebooks = async () => {
      if (!userIdRef.current) return;
      const response = await fetch(`/api/notebook/user/${userIdRef.current}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        if (data.notebooks.length === 0) {
          setNotebooks([]);
          return;
        }
        // Get document counts for each notebook
        setNotebooks(
          data?.notebooks?.map(
            (notebook: any) =>
              ({
                id: notebook.id,
                title: notebook.title,
                description: notebook.description,
                createdDate: notebook.createdDate,
                lastModified: notebook.updatedDate,
                documentsCount: notebook.resourceCount || 0,
                status: notebook.status,
                documents: [],
                thumbnail: notebook.thumbnail,
              } as Notebook)
          )
        );
      }
    };

    fetchNotebooks();
  }, [userIdRef, setNotebooks]);

  const handleCreateNotebook = async (
    title: string,
    description?: string,
    thumbnail?: string
  ) => {
    const newNotebook: Notebook = {
      id: Date.now().toString(),
      title,
      description,
      createdDate: new Date().toISOString().split("T")[0],
      lastModified: new Date().toISOString().split("T")[0],
      documentsCount: 0,
      status: "active",
      documents: [],
      thumbnail: thumbnail || "📚",
    };

    // Create the notebook in the database
    const response = await fetch("/api/notebook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userIdRef.current,
        title,
        description: description || "",
        thumbnail: thumbnail || "📚",
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        newNotebook.id = data.notebook.id; // Update with real ID from backend
      }
    }

    setNotebooks((prev) => [newNotebook, ...prev]);
  };

  const handleEditNotebook = (id: string, newTitle: string) => {
    setNotebooks((prev) =>
      prev.map((notebook) =>
        notebook.id === id
          ? {
              ...notebook,
              title: newTitle,
              lastModified: new Date().toISOString().split("T")[0],
            }
          : notebook
      )
    );
    setEditingNotebook(null);
    setEditTitle("");
  };

  const handleDeleteNotebook = async (id: string) => {
    if (confirm("Are you sure you want to delete this notebook?")) {
      // Delete the notebook from the database
      await fetch(`/api/notebook/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setNotebooks((prev) => prev.filter((notebook) => notebook.id !== id));
    }
  };

  const startEditingNotebook = (notebook: Notebook) => {
    setEditingNotebook(notebook.id);
    setEditTitle(notebook.title);
    setOpenDropdown(null); // Close dropdown when starting edit
  };

  const filteredNotebooks = notebooks?.filter((notebook) => {
    const matchesSearch =
      notebook?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notebook?.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || notebook.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: notebooks.length,
    active: notebooks.filter((n) => n.status === "active").length,
    totalDocuments: notebooks.reduce((sum, n) => sum + n.documentsCount, 0),
  };

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>My Notebooks</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Notebooks</h1>
            <p className="text-muted-foreground">
              Manage and organize your notebooks
            </p>
          </div>
          <Button
            className="flex items-center gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Create Notebook
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1 truncate">
                  Total Notebooks
                </p>
                <p className="text-xl font-bold text-foreground">
                  {stats.total}
                </p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0 ml-2">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1 truncate">Active</p>
                <p className="text-xl font-bold text-foreground">
                  {stats.active}
                </p>
              </div>
              <div className="p-2 bg-green-500/10 rounded-lg flex-shrink-0 ml-2">
                <BookOpen className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1 truncate">Documents</p>
                <p className="text-xl font-bold text-foreground">
                  {stats.totalDocuments}
                </p>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-lg flex-shrink-0 ml-2">
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search notebooks..."
                className="pl-10"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-input rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors bg-background text-foreground"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Notebooks */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredNotebooks?.map((notebook) => (
              <Link key={notebook.id} href={`/user/notebooks/${notebook.id}`}>
                <div className="bg-card border border-border rounded-lg p-5 hover:shadow-md transition-all duration-200 cursor-pointer group min-h-[240px] flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-4xl">{notebook.thumbnail}</div>
                    <DropdownMenu
                      open={openDropdown === notebook.id}
                      onOpenChange={(open) =>
                        setOpenDropdown(open ? notebook.id : null)
                      }
                    >
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            startEditingNotebook(notebook);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit title
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteNotebook(notebook.id);
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex-1 flex flex-col">
                    {editingNotebook === notebook.id ? (
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => {
                          if (editTitle.trim()) {
                            handleEditNotebook(notebook.id, editTitle.trim());
                          } else {
                            setEditingNotebook(null);
                            setEditTitle("");
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            if (editTitle.trim()) {
                              handleEditNotebook(notebook.id, editTitle.trim());
                            }
                          } else if (e.key === "Escape") {
                            setEditingNotebook(null);
                            setEditTitle("");
                          }
                        }}
                        autoFocus
                        className="font-semibold text-foreground mb-2 text-lg"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      />
                    ) : (
                      <h3
                        className="font-semibold text-foreground mb-2 text-lg leading-tight line-clamp-2"
                        title={notebook.title}
                      >
                        {notebook.title}
                      </h3>
                    )}

                    {notebook.description && (
                      <p className="text-base text-muted-foreground mb-3 line-clamp-2 flex-1">
                        {notebook.description}
                      </p>
                    )}

                    <div className="space-y-2.5 mt-auto">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Documents:
                        </span>
                        <span className="px-2.5 py-1 bg-secondary text-secondary-foreground rounded text-sm font-medium">
                          {notebook.documentsCount}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="font-medium">{formatDate(notebook.lastModified)}</span>
                        </div>
                        <span className="pl-4 text-xs">{formatDateToString(notebook.lastModified)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">
                Notebooks ({filteredNotebooks.length})
              </h3>
            </div>
            <div className="divide-y divide-border">
              {filteredNotebooks.map((notebook) => (
                <Link
                  key={notebook.id}
                  href={`/user/notebooks/${notebook.id}`}
                >
                  <div className="p-6 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{notebook.thumbnail}</div>
                      <div className="flex-1 min-w-0">
                        {editingNotebook === notebook.id ? (
                          <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={() => {
                              if (editTitle.trim()) {
                                handleEditNotebook(
                                  notebook.id,
                                  editTitle.trim()
                                );
                              } else {
                                setEditingNotebook(null);
                                setEditTitle("");
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                if (editTitle.trim()) {
                                  handleEditNotebook(
                                    notebook.id,
                                    editTitle.trim()
                                  );
                                }
                              } else if (e.key === "Escape") {
                                setEditingNotebook(null);
                                setEditTitle("");
                              }
                            }}
                            autoFocus
                            className="font-semibold text-foreground mb-1"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          />
                        ) : (
                          <h3 className="font-semibold text-foreground truncate">
                            {notebook.title}
                          </h3>
                        )}
                        {notebook.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {notebook.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{notebook.documentsCount} documents</span>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            <div className="flex flex-col gap-0.5">
                              <span className="text-xs font-medium">{formatDate(notebook.lastModified)}</span>
                              <span className="text-[10px]">{formatDateToString(notebook.lastModified)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            notebook.status === "active"
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground"
                          }`}
                        >
                          {notebook.status}
                        </span>
                        <DropdownMenu
                          open={openDropdown === notebook.id}
                          onOpenChange={(open) =>
                            setOpenDropdown(open ? notebook.id : null)
                          }
                        >
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                startEditingNotebook(notebook);
                              }}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit title
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteNotebook(notebook.id);
                              }}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {filteredNotebooks.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No notebooks found
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterStatus !== "all"
                ? "Try changing your filters or search terms"
                : "You don't have any notebooks yet"}
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create your first notebook
            </Button>
          </div>
        )}
      </div>

      {/* Create Notebook Modal */}
      <CreateNotebookModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateNotebook}
      />
    </SidebarInset>
  );
};

export default NotebooksPage;
