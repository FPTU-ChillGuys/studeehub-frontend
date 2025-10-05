"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FileText,
  Upload,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  Calendar,
  Plus,
  File,
  Image as ImageIcon,
  Video,
  X,
} from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

const DocumentsPage = () => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("my-documents");
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Set active tab based on URL parameter
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "upload") {
      setActiveTab("upload");
    } else if (tab === "my-documents") {
      setActiveTab("my-documents");
    } else {
      // Default to my-documents if no tab specified
      setActiveTab("my-documents");
    }
  }, [searchParams]);

  const documents = [
    {
      id: 1,
      name: "React Hooks Guide.pdf",
      type: "PDF",
      size: "2.5 MB",
      uploadDate: "2024-10-01",
      status: "Đã xử lý",
      questionsGenerated: 25,
    },
    {
      id: 2,
      name: "JavaScript ES6+ Features.docx",
      type: "DOCX",
      size: "1.8 MB",
      uploadDate: "2024-09-28",
      status: "Đã xử lý",
      questionsGenerated: 18,
    },
    {
      id: 3,
      name: "Node.js Best Practices.pdf",
      type: "PDF",
      size: "3.2 MB",
      uploadDate: "2024-09-25",
      status: "Đang xử lý",
      questionsGenerated: 0,
    },
    {
      id: 4,
      name: "Database Design Principles.pptx",
      type: "PPTX",
      size: "4.1 MB",
      uploadDate: "2024-09-20",
      status: "Đã xử lý",
      questionsGenerated: 32,
    },
  ];

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
      case "doc":
      case "docx":
      case "txt":
        return <File className="w-6 h-6 text-blue-500" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <ImageIcon className="w-6 h-6 text-green-500" />;
      case "mp4":
      case "avi":
      case "mov":
        return <Video className="w-6 h-6 text-red-500" />;
      default:
        return <FileText className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Documents</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col">
        {/* Tab Navigation */}
        <div className="bg-card border-b border-border px-6">
          <nav className="flex space-x-8">
            <Link
              href="/dashboard/documents?tab=upload"
              className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "upload"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Upload Document
            </Link>
            <Link
              href="/dashboard/documents?tab=my-documents"
              className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "my-documents"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              My Documents
            </Link>
          </nav>
        </div>

        <div className="p-6">
          {/* Upload Tab */}
          {activeTab === "upload" && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Upload Documents
                </h2>
                <p className="text-muted-foreground">
                  Upload your documents to generate AI-powered study questions
                </p>
              </div>

              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Drag and drop your files here
                </h3>
                <p className="text-muted-foreground mb-4">
                  or click to browse files
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.mp4,.avi,.mov"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Choose Files
                </label>
                <p className="text-xs text-muted-foreground mt-4">
                  Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, MP4, AVI,
                  MOV
                </p>
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Selected Files ({uploadedFiles.length})
                  </h3>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-card border border-border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          {getFileIcon(file.name)}
                          <div>
                            <p className="font-medium text-foreground">
                              {file.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end mt-6">
                    <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                      Upload Documents
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* My Documents Tab */}
          {activeTab === "my-documents" && (
            <>
              {/* Search and Filter */}
              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm tài liệu..."
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                  />
                </div>
                <button className="px-4 py-2 border border-input rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>Bộ lọc</span>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Tổng tài liệu
                      </p>
                      <p className="text-2xl font-bold text-foreground">48</p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Đã xử lý
                      </p>
                      <p className="text-2xl font-bold text-foreground">42</p>
                    </div>
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <FileText className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Đang xử lý
                      </p>
                      <p className="text-2xl font-bold text-foreground">3</p>
                    </div>
                    <div className="p-3 bg-yellow-500/10 rounded-lg">
                      <FileText className="w-6 h-6 text-yellow-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Câu hỏi tạo
                      </p>
                      <p className="text-2xl font-bold text-foreground">284</p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Table */}
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <h3 className="text-lg font-semibold text-foreground">
                    Danh sách tài liệu
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">
                          Tên tài liệu
                        </th>
                        <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">
                          Loại
                        </th>
                        <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">
                          Kích thước
                        </th>
                        <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">
                          Ngày tải
                        </th>
                        <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">
                          Trạng thái
                        </th>
                        <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">
                          Câu hỏi
                        </th>
                        <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc) => (
                        <tr
                          key={doc.id}
                          className="border-b border-border hover:bg-muted/50 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <FileText className="w-4 h-4 text-primary" />
                              </div>
                              <span className="text-foreground font-medium">
                                {doc.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-muted-foreground">
                            {doc.type}
                          </td>
                          <td className="py-4 px-6 text-muted-foreground">
                            {doc.size}
                          </td>
                          <td className="py-4 px-6 text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{doc.uploadDate}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                doc.status === "Đã xử lý"
                                  ? "bg-green-500/10 text-green-500"
                                  : "bg-yellow-500/10 text-yellow-500"
                              }`}
                            >
                              {doc.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-foreground font-medium">
                            {doc.questionsGenerated}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2">
                              <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
                                <Download className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </SidebarInset>
  );
};

export default DocumentsPage;
