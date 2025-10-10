"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { SidebarInset } from "@/components/ui/sidebar";
import UploadModal from "@/components/modals/UploadModal";
import { Notebook, Document, ChatMessage } from "@/Types";
import NotebookHeader from "@/components/notebook-detail/NotebookHeader";
import ChatSection from "@/components/notebook-detail/ChatSection";
import DocumentsPanel from "@/components/notebook-detail/DocumentsPanel";
import { getFileIcon } from "@/components/notebook-detail/utils";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

const NotebookDetailPage = () => {
  const params = useParams();
  const notebookId = params.id as string;

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
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
    documents: [],
  });

  //Chatbot by Vercel AI SDK
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chatbot",
    }),
  });

  // // Initialize welcome message
  // useEffect(() => {
  //   const welcomeMessage: ChatMessage = {
  //     id: "welcome",
  //     text: `Hello! I am the AI assistant for the notebook "${notebook.title}". I can help you:\n\n• Answer questions about the content of your documents\n• Create review questions from the documents\n• Summarize and explain concepts\n• Provide effective study guidance\n\nFeel free to ask me anything about your documents!`,
  //     isUser: false,
  //     timestamp: new Date(),
  //     notebookId: notebookId,
  //   };
  //   setMessages([welcomeMessage]);
  // }, [notebook.title, notebookId]);

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
  };

  const filteredDocuments = notebook.documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const completedDocsCount = notebook.documents.filter(
    (d) => d.status === "completed"
  ).length;

  const handleToggleDocument = (docId: string, selected: boolean) => {
    const newSelected = new Set(selectedDocuments);
    if (selected) {
      newSelected.add(docId);
    } else {
      newSelected.delete(docId);
    }
    setSelectedDocuments(newSelected);
  };

  const handleSelectAll = () => {
    const completedDocs = notebook.documents
      .filter((d) => d.status === "completed")
      .map((d) => d.id);
    setSelectedDocuments(new Set(completedDocs));
  };

  const handleClearSelection = () => {
    setSelectedDocuments(new Set());
  };

  const handleSendMessage = (message: string) => {
    sendMessage({ text: message });
  };

  return (
    <SidebarInset>
      <NotebookHeader notebookTitle={notebook.title} />

      <div className="flex flex-1 h-[calc(100vh-4rem)]">
        <ChatSection
          notebook={notebook}
          messages={messages}
          handleSendMessage={handleSendMessage}
          selectedDocuments={selectedDocuments}
          getFileIcon={getFileIcon}
          status={status}
        />

        <DocumentsPanel
          documents={filteredDocuments}
          selectedDocuments={selectedDocuments}
          onToggleDocument={handleToggleDocument}
          onSelectAll={handleSelectAll}
          onClearSelection={handleClearSelection}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setIsUploadModalOpen={setIsUploadModalOpen}
          getFileIcon={getFileIcon}
          completedDocsCount={completedDocsCount}
        />
      </div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadFiles}
      />
    </SidebarInset>
  );
};

export default NotebookDetailPage;
