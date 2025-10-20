"use client";

import { Plus } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Notebook } from "@/Types";
import CreateNotebookModal from "@/components/modals/CreateNotebookModal";
import useStateRef from "react-usestateref";
import { useEffect } from "react";
import { ConvertAnyToNotebook, NewNotebook } from "@/lib/mapping/notebook";
import { AuthService } from "@/service/authService";
import { deleteNotebook, getNotebook, postNotebook } from "@/features/notebook/api/notebook";
import {
  NotebookStats,
  NotebookControls,
  NotebookCard,
  NotebookListItem,
  EmptyNotebooks,
  LoadingNotebooks,
} from "@/components/my-documents";

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
  const [isLoading, setIsLoading] = useStateRef(true);

  //Get userId from localStorage
  const [userId, setUserId, userIdRef] = useStateRef<string | null>(null);

  // Sample notebooks data
  const [notebooks, setNotebooks] = useStateRef<Notebook[]>([]);

  //Get userId from localStorage
  useEffect(() => {
    AuthService.getCurrentUser().then((user) => {
      if (user) {
        setUserId(user.id);
      }
    });
  }, [setUserId, userIdRef]);

  // Fetch notebooks from the server
  useEffect(() => {
    const fetchNotebooks = async () => {
      if (!userIdRef.current) return;
      
      setIsLoading(true);
      try {
        const response = await getNotebook(`user/${userIdRef.current}`);

        if (response.success) {
          if (response.data.notebooks.length === 0) {
            setNotebooks([]);
          } else {
            // Get document counts for each notebook
            setNotebooks(
              response.data.notebooks.map((notebook: any) =>
                ConvertAnyToNotebook(notebook)
              )
            );
          }
        }
      } catch (error) {
        console.error("Error fetching notebooks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotebooks();
  }, [userId, userIdRef, setNotebooks, setIsLoading]);

  const handleCreateNotebook = async (
    title: string,
    description?: string,
    thumbnail?: string
  ) => {
    const newNotebook: Notebook = NewNotebook();

    // Create the notebook in the database
    const response = await postNotebook({
      userId: userIdRef.current,
      title,
      description: description || "",
      thumbnail: thumbnail || "📚",
    });

    if (response.success && response.data.notebook) {
      newNotebook.id = response.data.notebook.id; // Update with real ID from backend
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
      const response = await deleteNotebook(id);
      if (response.success) {
        setNotebooks((prev) => prev.filter((notebook) => notebook.id !== id));
      }
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
        <NotebookStats
          total={stats.total}
          active={stats.active}
          totalDocuments={stats.totalDocuments}
        />

        {/* Controls */}
        <NotebookControls
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Notebooks */}
        {isLoading ? (
          <LoadingNotebooks />
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredNotebooks?.map((notebook) => (
              <NotebookCard
                key={notebook.id}
                notebook={notebook}
                isEditing={editingNotebook === notebook.id}
                editTitle={editTitle}
                onEditTitleChange={setEditTitle}
                onStartEdit={() => startEditingNotebook(notebook)}
                onSaveEdit={() => {
                  if (editTitle.trim()) {
                    handleEditNotebook(notebook.id, editTitle.trim());
                  } else {
                    setEditingNotebook(null);
                    setEditTitle("");
                  }
                }}
                onCancelEdit={() => {
                  setEditingNotebook(null);
                  setEditTitle("");
                }}
                onDelete={() => handleDeleteNotebook(notebook.id)}
                openDropdown={openDropdown === notebook.id}
                onDropdownChange={(open) =>
                  setOpenDropdown(open ? notebook.id : null)
                }
              />
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
                <NotebookListItem
                  key={notebook.id}
                  notebook={notebook}
                  isEditing={editingNotebook === notebook.id}
                  editTitle={editTitle}
                  onEditTitleChange={setEditTitle}
                  onStartEdit={() => startEditingNotebook(notebook)}
                  onSaveEdit={() => {
                    if (editTitle.trim()) {
                      handleEditNotebook(notebook.id, editTitle.trim());
                    } else {
                      setEditingNotebook(null);
                      setEditTitle("");
                    }
                  }}
                  onCancelEdit={() => {
                    setEditingNotebook(null);
                    setEditTitle("");
                  }}
                  onDelete={() => handleDeleteNotebook(notebook.id)}
                  openDropdown={openDropdown === notebook.id}
                  onDropdownChange={(open) =>
                    setOpenDropdown(open ? notebook.id : null)
                  }
                />
              ))}
            </div>
          </div>
        )}

        {!isLoading && filteredNotebooks.length === 0 && (
          <EmptyNotebooks
            hasFilters={!!searchTerm || filterStatus !== "all"}
            onCreateClick={() => setIsCreateModalOpen(true)}
          />
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
