"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { SidebarInset } from "@/components/ui/sidebar";
import UploadModal from "@/components/modals/UploadModal";
import { Notebook, Document, ChatMessage, FlashcardDeck } from "@/Types";
import NotebookHeader from "@/components/notebook-detail/NotebookHeader";
import ChatSection from "@/components/notebook-detail/ChatSection";
import DocumentsPanel from "@/components/notebook-detail/DocumentsPanel";
import { getFileIcon } from "@/components/notebook-detail/utils";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import useState from "react-usestateref";
import FlashcardsPanel from "@/components/notebook-detail/FlashcardsPanel";
import { IFlashcard } from "react-quizlet-flashcard";
import "react-quizlet-flashcard/dist/index.css";
import { nanoid } from "nanoid";

const NotebookDetailPage = () => {
  const params = useParams();
  const notebookId = params.id as string;

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocuments, setSelectedDocuments, selectedDocumentsRef] =
    useState<Set<string>>(new Set());

  const [flashcards, setFlashcards, flashcardsRef] = useState<FlashcardDeck[]>(
    []
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
  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chatbot",
      prepareSendMessagesRequest: ({ messages }) => {
        return {
          body: {
            messages,
            resourceIds: Array.from(selectedDocumentsRef.current) ?? [],
            notebookId: notebookId,
          },
        };
      },
    }),
  });

  //Load existing chat messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/chatbot/${notebookId}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched messages:", data);
          setMessages(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [notebookId, setMessages]);

  //Get file upload and document management
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`/api/file/${notebookId}`);
        if (response.ok) {
          const data = await response.json();
          // Update documents in notebook state
          if (data.success === true) {
            // Get documents from response
            const documents: Document[] =
              data?.resources?.map((res: any) => ({
                id: res.id,
                name: res.fileName,
                type: res.type,
                url: res.url,
                status: "completed",
              })) || [];
            setNotebook((prev) => ({
              ...prev,
              documents: documents,
              documentsCount: documents.length,
            }));
          } else if (data.success === false || data.success === undefined) {
            console.error("Failed to fetch documents:", data.message);
          }
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, [notebookId]);

  const handleUploadFiles = async (files: File[]) => {
    try {
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

      //Upload files to backend
      let resourceIds: string[] = [];
      const uploadToServer = async () => {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("files", file);
        });
        formData.append("notebookId", notebookId);

        // Upload files to server
        try {
          const response = await fetch("/api/file/upload", {
            method: "POST",
            body: formData,
          });
          if (!response.ok) {
            throw new Error("Failed to upload files");
          }
          const data = await response.json();
          if (data.success === true) {
            console.log("Files uploaded successfully:", data);
            resourceIds = data.resourceIds || [];
          } else {
            console.error("File upload failed:", data.message);
          }
        } catch (error) {
          console.error("Error uploading files:", error);
        }
      };
      // Run upload
      await uploadToServer();

      //Update document status to completed (temporary)
      setNotebook((prev) => {
        let y = 0;
        return {
          ...prev,
          documents: prev.documents.map((doc) => {
            if (
              doc.status === "processing" &&
              newDocuments.some((d) => d.id === doc.id)
            ) {
              const updatedDoc = {
                ...doc,
                status: "completed" as const,
                id: resourceIds[y],
              };
              y++;
              return updatedDoc;
            }
            return doc;
          }),
          lastModified: new Date().toISOString().split("T")[0],
        };
      });
      console.log("Resource IDs after upload:", resourceIds);
      console.log("Notebook after upload:", notebook);
    } catch (error) {
      console.error("Error in handleUploadFiles:", error);
    }
  };

  const filteredDocuments = notebook.documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const completedDocsCount = notebook.documents.filter(
    (d) => d.status === "completed"
  ).length;

  const handleToggleDocument = (resourceId: string, selected: boolean) => {
    const newSelected = new Set(selectedDocuments);
    if (selected) {
      newSelected.add(resourceId);
    } else {
      newSelected.delete(resourceId);
    }
    setSelectedDocuments(newSelected);
    console.log(
      "Selected documents:",
      Array.from(selectedDocumentsRef.current)
    );
  };

  const handleSelectAll = () => {
    const completedDocs = notebook.documents
      .filter((d) => d.status === "completed")
      .map((d) => d.id);
    setSelectedDocuments(new Set(completedDocs));
    console.log(
      "Selected all documents:",
      Array.from(selectedDocumentsRef.current)
    );
  };

  const handleClearSelection = () => {
    setSelectedDocuments(new Set());
  };

  const handleSendMessage = (message: string) => {
    sendMessage({ text: message });
  };

  //Generate flashcards from selected documents
  const onGenerateFlashcards = async () => {
    const response = await fetch(`/api/flashcard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notebookId: notebookId,
        resourceIds: Array.from(selectedDocumentsRef.current) ?? [],
      }),
    }).then((res) => res.json());

    if (response.success === true) {
      console.log("Flashcards generated:", response);
      // Map response to IFlashcard format
      const generatedFlashcard: FlashcardDeck = {
        id: nanoid(),
        title: response.title,
        cards: response?.flashcards?.map((fc: any) => ({
          front: {
            html: (
              <div className="flex items-center justify-center h-full w-full p-6">
                {fc.front}
              </div>
            ),
          },
          back: {
            html: (
              <div className="flex items-center justify-center h-full w-full p-6">
                {fc.back}
              </div>
            ),
          },
          id: fc.id,
        })),
        cardCount: response.flashcards.length,
      };
      setFlashcards([...flashcardsRef.current, generatedFlashcard]);
    }
  };

  //Get flashcards for this notebook
  useEffect(() => {
    const fetchFlashcards = async () => {
      const response = await fetch(`/api/flashcard/${notebookId}`);
      const data = await response.json();
      if (data.success === true) {
        console.log("Fetched flashcards:", data.flashcards);
        const fetchedFlashcards: FlashcardDeck[] = data.flashcards.map(
          (fc: any) => ({
            id: fc.id,
            title: fc.title,
            cardCount: fc.cardCount,
            cards: fc.cards.map((card: any, index: number) => ({
              front: {
                html: (
                  <div className="flex items-center justify-center h-full w-full p-6">
                    {card?.front || "No content"}
                  </div>
                ),
              },
              back: {
                html: (
                  <div className="flex items-center justify-center h-full w-full p-6">
                    {card?.back || "No content"}
                  </div>
                ),
              },
            })),
          })
        );
        setFlashcards(fetchedFlashcards);
      } else {
        console.error("Failed to fetch flashcards:", data.message);
      }
    };
    fetchFlashcards();
  }, [notebookId, setFlashcards]);

  return (
    <SidebarInset>
      <NotebookHeader notebookTitle={notebook.title} />

      <div className="flex flex-1 h-[calc(100vh-4rem)]">
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

        <ChatSection
          notebook={notebook}
          messages={messages}
          handleSendMessage={handleSendMessage}
          selectedDocuments={selectedDocuments}
          getFileIcon={getFileIcon}
          status={status}
        />
        <FlashcardsPanel
          onGenerateFlashcards={onGenerateFlashcards}
          setFlashcards={setFlashcards}
          flashcards={flashcardsRef.current}
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
