"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Search,
  UserPlus,
  MoreVertical,
  Pencil,
  Ban,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PaginationParams, UserListFilters } from "@/features/admin";
import userService from "@/service/userService";
import { UserProfile } from "@/Types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function UserManagementPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState<UserListFilters & PaginationParams>({
    status: undefined,
    searchTerm: "",
    sortBy: "createdAt",
    sortDescending: true,
    pageNumber: 1,
    pageSize: 10,
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = { ...filters };
      const response = await userService.getUsers(params);

      // The response is already the paginated data, no need to access .data
      setUsers(response.data || []);
      setPagination({
        pageNumber: response.page || 1,
        pageSize: response.pageSize || 10,
        totalCount: response.totalCount || 0,
        totalPages: response.totalPages || 1,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleStatusChange = async (userId: string, status: boolean) => {
    try {
      await userService.updateUserStatus(userId, status);
      toast.success(`User status updated to ${status}`);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
    }
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, pageNumber: page }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset to first page when searching
    setFilters((prev) => ({ ...prev, pageNumber: 1 }));
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-yellow-100 text-yellow-800",
      suspended: "bg-red-100 text-red-800",
    };

    return (
      <Badge
        className={`${
          statusMap[status as keyof typeof statusMap] || "bg-gray-100"
        } capitalize`}
      >
        {status}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="w-full">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Admin Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage all users and their permissions
          </p>
        </div>
        <Button onClick={() => router.push("/admin/users/new")}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                {loading
                  ? "Loading..."
                  : `${pagination.totalCount} users found`}
              </CardDescription>
            </div>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8 sm:w-[300px]"
                  value={filters.searchTerm}
                  onChange={(e) =>
                    setFilters({ ...filters, searchTerm: e.target.value })
                  }
                />
              </div>
              <Select
                value={filters.status || ""}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    status: value as
                      | "active"
                      | "inactive"
                      | "suspended"
                      | undefined,
                    pageNumber: 1,
                  })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full rounded-md border overflow-x-auto">
            <Table className="w-full table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%]">User</TableHead>
                  <TableHead className="w-[25%]">Email</TableHead>
                  <TableHead className="w-[15%]">Status</TableHead>
                  <TableHead className="w-[15%]">Joined Date</TableHead>
                  <TableHead className="w-[15%] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell className="p-0">
                      <div className="w-[30%] inline-block align-top p-4 border-r">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                      </div>
                      <div className="w-[25%] inline-block align-top p-4 border-r">
                        <div className="h-4 bg-muted rounded w-5/6"></div>
                      </div>
                      <div className="w-[15%] inline-block align-top p-4 border-r">
                        <div className="h-4 bg-muted rounded w-16"></div>
                      </div>
                      <div className="w-[15%] inline-block align-top p-4 border-r">
                        <div className="h-4 bg-muted rounded w-24"></div>
                      </div>
                      <div className="w-[15%] inline-block align-top p-4 text-right">
                        <div className="h-8 bg-muted rounded w-8 inline-block"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center p-8">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <span className="text-gray-500">
                              {user.fullName?.[0]?.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{user.fullName}</div>
                            <div className="text-xs text-muted-foreground">
                              {user.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {getStatusBadge(user.isActive ? "active" : "inactive")}
                      </TableCell>
                      <TableCell>
                        {format(new Date(user.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/admin/users/${user.id}`)
                              }
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            {!user.isActive && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(user.id, true)
                                }
                              >
                                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                Activate
                              </DropdownMenuItem>
                            )}
                            {user.isActive && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(user.id, false)
                                }
                              >
                                <Ban className="mr-2 h-4 w-4 text-yellow-600" />
                                Suspend
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {!loading && pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing{" "}
                <strong>
                  {(pagination.pageNumber - 1) * pagination.pageSize + 1}
                </strong>{" "}
                to{" "}
                <strong>
                  {Math.min(
                    pagination.pageNumber * pagination.pageSize,
                    pagination.totalCount
                  )}
                </strong>{" "}
                of <strong>{pagination.totalCount}</strong> users
              </div>
              <Pagination className="justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (pagination.pageNumber > 1) {
                          handlePageChange(pagination.pageNumber - 1);
                        }
                      }}
                      className={
                        pagination.pageNumber === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.pageNumber <= 3) {
                        pageNum = i + 1;
                      } else if (
                        pagination.pageNumber >=
                        pagination.totalPages - 2
                      ) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.pageNumber - 2 + i;
                      }
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(pageNum);
                            }}
                            isActive={pageNum === pagination.pageNumber}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                  )}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (pagination.pageNumber < pagination.totalPages) {
                          handlePageChange(pagination.pageNumber + 1);
                        }
                      }}
                      className={
                        pagination.pageNumber === pagination.totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
