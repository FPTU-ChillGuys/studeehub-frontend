"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  MessageCircle,
  Send,
  FileText,
  Search,
  Download,
  Eye,
  Calendar,
  ArrowLeft,
  Upload,
  MoreVertical,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UploadModal from "@/components/modals/UploadModal";
import { Notebook, Document, ChatMessage } from "@/Types";
import Link from "next/link";

const NotebookDetailPage = () => {
  const params = useParams();
  const notebookId = params.id as string;

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(
    new Set()
  );

  // Sample notebook data - In real app, fetch based on notebookId
  const [notebook, setNotebook] = useState<Notebook>({
    id: notebookId,
    title: "Philosophy Textbook: Dialectical Materialism",
    description:
      "Study of fundamental principles of Marxist-Leninist philosophy",
    createdDate: "2024-09-24",
    lastModified: "2024-10-01",
    documentsCount: 3,
    totalQuestions: 45,
    status: "active",
    thumbnail: "🏛️",
    documents: [
      {
        id: "1",
        name: "Chapter 1 - Philosophy and Life.pdf",
        type: "PDF",
        size: "2.5 MB",
        uploadDate: "2024-09-24",
        status: "completed",
        questionsGenerated: 15,
        notebookId: notebookId,
      },
      {
        id: "2",
        name: "Chapter 2 - Matter and Consciousness.pdf",
        type: "PDF",
        size: "3.2 MB",
        uploadDate: "2024-09-25",
        status: "completed",
        questionsGenerated: 18,
        notebookId: notebookId,
      },
      {
        id: "3",
        name: "Chapter 3 - Dialectical Laws.docx",
        type: "DOCX",
        size: "1.8 MB",
        uploadDate: "2024-09-26",
        status: "processing",
        questionsGenerated: 0,
        notebookId: notebookId,
      },
    ],
  });

  // Initialize welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: "welcome",
      text: `Hello! I am the AI assistant for the notebook "${notebook.title}". I can help you:\n\n• Answer questions about the content of your documents\n• Create review questions from the documents\n• Summarize and explain concepts\n• Provide effective study guidance\n\nFeel free to ask me anything about your documents!`,
      isUser: false,
      timestamp: new Date(),
      notebookId: notebookId,
    };
    setMessages([welcomeMessage]);
  }, [notebook.title, notebookId]);

  const handleSendMessage = () => {
    if (inputMessage.trim() && selectedDocuments.size > 0) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        text: inputMessage,
        isUser: true,
        timestamp: new Date(),
        notebookId: notebookId,
      };
      setMessages((prev) => [...prev, newMessage]);
      setInputMessage("");

      // Get selected document names for the response
      const selectedDocNames = Array.from(selectedDocuments)
        .map((docId) => notebook.documents.find((d) => d.id === docId)?.name)
        .filter(Boolean);

      // Simulate AI response
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: `Based on the content from ${
            selectedDocNames.length
          } selected documents (${selectedDocNames.join(
            ", "
          )}), I can respond as follows:\n\nThis is the answer synthesized from the selected documents...`,
          isUser: false,
          timestamp: new Date(),
          notebookId: notebookId,
          sources: Array.from(selectedDocuments), // Reference to selected document IDs
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleUploadFiles = (files: File[]) => {
    // Convert uploaded files to documents
    const newDocuments: Document[] = files.map((file, index) => ({
      id: (Date.now() + index).toString(),
      name: file.name,
      type:
        (file.name.split(".").pop()?.toUpperCase() as Document["type"]) ||
        "PDF",
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      uploadDate: new Date().toISOString().split("T")[0],
      status: "processing",
      questionsGenerated: 0,
      notebookId: notebookId,
    }));

    // Update notebook with new documents
    setNotebook((prev) => ({
      ...prev,
      documents: [...prev.documents, ...newDocuments],
      documentsCount: prev.documentsCount + newDocuments.length,
      lastModified: new Date().toISOString().split("T")[0],
    }));

    // Add success message to chat
    const successMessage: ChatMessage = {
      id: Date.now().toString(),
      text: `Upload Successfully ${files.length} documents. I am processing and analyzing the content. You will be able to chat about these documents in a few minutes.`,
      isUser: false,
      timestamp: new Date(),
      notebookId: notebookId,
    };
    setMessages((prev) => [...prev, successMessage]);
  };

  const filteredDocuments = notebook.documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="w-5 h-5 text-red-500" />;
      case "docx":
      case "doc":
        return <FileText className="w-5 h-5 text-blue-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
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
              <BreadcrumbLink href="/dashboard/my-documents">
                My Notebooks
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[200px] truncate">
                {notebook.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 h-[calc(100vh-4rem)]">
        {/* Chat Section - Now takes 70% */}
        <div className="w-[70%] border-r border-border flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-border bg-card">
            <div className="flex items-start gap-3">
              <div className="text-2xl">{notebook.thumbnail}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Link href="/dashboard/my-documents">
                    <Button variant="ghost" size="sm">
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                  </Link>
                  <h2 className="text-lg font-semibold text-foreground truncate">
                    {notebook.title}
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {notebook.documentsCount} documents •{" "}
                  {notebook.totalQuestions} questions generated
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 ${
                    message.isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-foreground"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border/20">
                      <p className="text-xs text-muted-foreground">
                        Nguồn:{" "}
                        {message.sources
                          .map((sourceId) => {
                            const doc = notebook.documents.find(
                              (d) => d.id === sourceId
                            );
                            return doc?.name;
                          })
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  )}
                  <p
                    className={`text-xs mt-1 ${
                      message.isUser
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-border">
            {/* Selected Documents Display */}
            {selectedDocuments.size > 0 && (
              <div className="mb-3 p-2 bg-muted/50 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-2">
                  Chatting with {selectedDocuments.size} documents:
                </p>
                <div className="flex flex-wrap gap-1">
                  {Array.from(selectedDocuments).map((docId) => {
                    const doc = notebook.documents.find((d) => d.id === docId);
                    return doc ? (
                      <span
                        key={docId}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                      >
                        {getFileIcon(doc.type)}
                        <span className="max-w-[120px] truncate">
                          {doc.name}
                        </span>
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={
                  selectedDocuments.size > 0
                    ? "Ask about the content of the selected documents..."
                    : "Select documents to start chatting..."
                }
                disabled={selectedDocuments.size === 0}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={selectedDocuments.size === 0 || !inputMessage.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Documents Management Section - Now takes 30% */}
        <div className="w-[30%] flex flex-col">
          {/* Documents Header */}
          <div className="p-4 border-b border-border bg-card">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Documents
                </h2>
                <p className="text-sm text-muted-foreground">
                  Manage documents within this notebook
                </p>
              </div>
              <Button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center gap-2"
                size="sm"
              >
                <Upload className="w-4 h-4" />
                Upload
              </Button>
            </div>
          </div>

          {/* Selected Documents Info */}
          <div className="px-4 py-2 bg-muted/50 border-b border-border">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {selectedDocuments.size > 0
                  ? `${selectedDocuments.size} documents selected for chat`
                  : "Select documents to chat with AI"}
              </p>
              {notebook.documents.filter((d) => d.status === "completed")
                .length > 0 && (
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => {
                      const completedDocs = notebook.documents
                        .filter((d) => d.status === "completed")
                        .map((d) => d.id);
                      setSelectedDocuments(new Set(completedDocs));
                    }}
                  >
                    Select All
                  </Button>
                  {selectedDocuments.size > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => setSelectedDocuments(new Set())}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search documents..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Documents List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className={`bg-card border rounded-lg p-4 hover:shadow-sm transition-all ${
                    selectedDocuments.has(doc.id)
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <div className="flex items-center pt-1">
                      <input
                        type="checkbox"
                        id={`doc-${doc.id}`}
                        checked={selectedDocuments.has(doc.id)}
                        onChange={(e) => {
                          const newSelected = new Set(selectedDocuments);
                          if (e.target.checked) {
                            newSelected.add(doc.id);
                          } else {
                            newSelected.delete(doc.id);
                          }
                          setSelectedDocuments(newSelected);
                        }}
                        disabled={doc.status !== "completed"}
                        className="w-4 h-4 text-primary border-2 border-border rounded focus:ring-2 focus:ring-primary focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    {/* File Icon */}
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {getFileIcon(doc.type)}
                    </div>

                    {/* Document Info */}
                    <div className="flex-1 min-w-0">
                      <label
                        htmlFor={`doc-${doc.id}`}
                        className="font-medium text-foreground truncate cursor-pointer block"
                        title={doc.name}
                      >
                        {doc.name}
                      </label>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span>{doc.type}</span>
                        <span>•</span>
                        <span>{doc.size}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{doc.uploadDate}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            doc.status === "completed"
                              ? "bg-green-500/10 text-green-500"
                              : doc.status === "processing"
                              ? "bg-yellow-500/10 text-yellow-500"
                              : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {doc.status === "completed"
                            ? "Processed"
                            : doc.status === "processing"
                            ? "Processing"
                            : "Error"}
                        </span>
                        {doc.questionsGenerated &&
                          doc.questionsGenerated > 0 && (
                            <span className="text-xs text-muted-foreground">
                              {doc.questionsGenerated} questions
                            </span>
                          )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreVertical className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredDocuments.length === 0 && (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm
                    ? "No matching documents found"
                    : "No documents in this notebook yet"}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="mt-4"
                    variant="outline"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload first document
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadFiles}
      />
    </SidebarInset>
  );
};

export default NotebookDetailPage;
