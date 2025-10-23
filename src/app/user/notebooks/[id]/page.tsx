"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { SidebarInset } from "@/components/ui/sidebar";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import UploadModal from "@/components/modals/UploadModal";
import { Notebook, Document, FlashcardDeck } from "@/Types";
import NotebookHeader from "@/components/notebook-detail/NotebookHeader";
import ChatSection from "@/components/notebook-detail/ChatSection";
import DocumentsPanel from "@/components/notebook-detail/DocumentsPanel";
import { getFileIcon } from "@/components/notebook-detail/utils";
import { LoadingNotebookDetail } from "@/components/notebook-detail";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import useState from "react-usestateref";
import FlashcardsPanel from "@/components/notebook-detail/FlashcardsPanel";
import "react-quizlet-flashcard/dist/index.css";
import { nanoid } from "nanoid";
import { uploadNotebookFile } from "@/features/notebook/api/upload";
import { getChatbot } from "@/features/chatbot/api/chatbot";
import { getNotebook } from "@/features/notebook/api/notebook";
import {
  deleteFlashcard,
  getFlashcards,
  postFlashcard,
  putFlashcard,
} from "@/features/flashcard/api/flashcard";
import { getFile } from "@/features/file/api/file";
import { deleteResource } from "@/features/resource/api/resource";
import { toast } from "sonner";
import { useTopLoader } from "nextjs-toploader";

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

  // Delete confirmation states
  const [deleteResourceDialogOpen, setDeleteResourceDialogOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null);
  const [deleteDeckDialogOpen, setDeleteDeckDialogOpen] = useState(false);
  const [deckToDelete, setDeckToDelete] = useState<string | null>(null);

  // Loading states
  const [isLoadingNotebook, setIsLoadingNotebook] = useState(true);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isLoadingFlashcards, setIsLoadingFlashcards] = useState(true);

  // Disable flashcard generation if no documents are selected
  const [isDisabled, setIsDisabled] = useState(true);

  const loader = useTopLoader();

  useEffect(() => {
    setIsDisabled(selectedDocuments.size === 0);
  }, [selectedDocuments]);

  // Sample notebook data - In real app, fetch based on notebookId
  const [notebook, setNotebook, notebookRef] = useState<Notebook>({
    id: "",
    title: "Unknown Notebook",
    createdDate: "",
    lastModified: "",
    documentsCount: 0,
    status: "active",
    documents: [],
    thumbnail: "",
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
            //Get selected files names
            fileNames: notebookRef.current.documents
              .filter((doc) => selectedDocumentsRef.current.has(doc.id))
              .map((doc) => doc.name),
          },
        };
      },
    }),
  });

  //Load existing chat messages
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      try {
        const response = await getChatbot(`${notebookId}`);
        if (response.success) {
          setMessages(response.data.messages || []);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoadingMessages(false);
      }
    };
    fetchMessages();
  }, [notebookId, setMessages]);

  //Get notebook details
  useEffect(() => {
    const fetchNotebookDetails = async () => {
      setIsLoadingNotebook(true);
      try {
        const response = await getNotebook(`${notebookId}`);
        if (response.success) {
          setNotebook({
            ...notebookRef.current,
            // id : response.data.id,
            // title : response.data.title,
            // description : response.data.description,
            ...response.data.notebook,
          } as Notebook);
        }
      } catch (error) {
        console.error("Error fetching notebook details:", error);
      } finally {
        setIsLoadingNotebook(false);
      }
    };

    fetchNotebookDetails();
  }, [notebookId, notebookRef, setNotebook]);

  //Get file upload and document management
  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoadingDocuments(true);
      try {
        const response = await getFile(`${notebookId}`);
        if (response.success) {
          const data = response.data;
          // Update documents in notebook state
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
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setIsLoadingDocuments(false);
      }
    };

    fetchDocuments();
  }, [notebookId, setNotebook]);

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
      let uploadStatus: "completed" | "error" = "completed";
      const uploadToServer = async () => {
        // Upload files to server
        loader.start();
        try {
          const response = await uploadNotebookFile(files, notebookId);
          loader.setProgress(50);

          if (!response.success) {
            uploadStatus = "error";
            toast.error("Upload failed!", {
              description:
                response.data?.message ||
                "Failed to upload files. Please try again or try upload smaller files under 1000 words.",
            });
          } else {
            resourceIds = response.data.resourceIds || [];
            toast.success("Files uploaded successfully!", {
              description: `${files.length} file(s) have been uploaded and are being processed.`,
            });
          }
        } catch (error) {
          uploadStatus = "error";
          console.error("Error uploading files:", error);
          toast.error("Upload failed!", {
            description:
              "Failed to upload files. Please try again or try upload smaller files under 1000 words.",
          });
        } finally {
          loader.done();
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
                status: uploadStatus,
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

  //Generate flashcards from selected documents
  const onGenerateFlashcards = async () => {
    setIsDisabled(true);
    loader.start();
    
    const response = await postFlashcard({
      notebookId: notebookId,
      resourceIds: Array.from(selectedDocumentsRef.current) ?? [],
    });
    
    loader.setProgress(50);

    if (response.success === true) {
      // Map response to IFlashcard format
      const generatedFlashcard: FlashcardDeck = {
        id: nanoid(),
        title: response.data.flashcards?.title,
        cards: response?.data.flashcards?.decks?.map((fc: any) => ({
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
        cardCount: response?.data.flashcards?.decks?.length,
      };
      setFlashcards([...flashcardsRef.current, generatedFlashcard]);
      toast.success("Flashcards generated successfully");
    }
    // Add toast notification for failure
    else {
      toast.error("Flashcard generation failed!", {
        description:
          response.data?.message ||
          "Unable to generate flashcards. Please try again.",
      });
    }
    
    loader.done();
    setIsDisabled(false);
  };

  //Generate custom flashcards with options
  const onGenerateCustomFlashcards = async (options: any) => {
    // TODO: Implement custom flashcard generation with options
    console.log("Custom flashcard options:", options);
    // Bạn có thể xử lý logic ở đây
    setIsDisabled(true);
    loader.start();
    
    const response = await postFlashcard({
      notebookId: notebookId,
      resourceIds: Array.from(selectedDocumentsRef.current) ?? [],
      options: options,
    });
    
    loader.setProgress(50);

    if (response.success === true) {
      // Map response to IFlashcard format
      const generatedFlashcard: FlashcardDeck = {
        id: nanoid(),
        title: response.data.flashcards?.title,
        cards: response?.data.flashcards?.decks?.map((fc: any) => ({
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
        cardCount: response?.data.flashcards?.decks?.length,
      };
      setFlashcards([...flashcardsRef.current, generatedFlashcard]);
      toast.success("Flashcards generated successfully");
    }
    // Add toast notification for failure
    else {
      toast.error("Flashcard generation failed!", {
        description:
          response.data?.message ||
          "Unable to generate flashcards. Please try again.",
      });
    }
    
    loader.done();
    setIsDisabled(false);
  };

  //Get flashcards for this notebook
  useEffect(() => {
    const fetchFlashcards = async () => {
      setIsLoadingFlashcards(true);
      try {
        const response = await getFlashcards(`${notebookId}`);
        if (response.success === true) {
          const fetchedFlashcards: FlashcardDeck[] =
            response.data.flashcards.map(
              (fc: any) =>
                ({
                  id: fc.id,
                  title: fc.title,
                  cardCount: fc.cardCount,
                  cards: fc.cards.map((card: any) => ({
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
                } as FlashcardDeck)
            );
          setFlashcards(fetchedFlashcards);
        } else {
          console.error("Failed to fetch flashcards:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      } finally {
        setIsLoadingFlashcards(false);
      }
    };
    fetchFlashcards();
  }, [notebookId, setFlashcards]);

  const onDeleteDeck = async (deckId: string) => {
    setDeckToDelete(deckId);
    setDeleteDeckDialogOpen(true);
  };

  const confirmDeleteDeck = async () => {
    if (!deckToDelete) return;

    loader.start();
    const response = await deleteFlashcard(deckToDelete);
    
    loader.setProgress(50);

    if (response.success === true) {
      setFlashcards(flashcardsRef.current.filter((deck) => deck.id !== deckToDelete));
      toast.success("Flashcard deck deleted successfully");
    } else {
      toast.error("Failed to delete flashcard deck");
    }

    loader.done();
    setDeleteDeckDialogOpen(false);
    setDeckToDelete(null);
  };

  const onUpdateDeckTitle = async (deckId: string, newTitle: string) => {
    // TODO: Implement API call to update deck title
    console.log("Update deck title:", deckId, newTitle);
    // Bạn có thể gọi API backend ở đây để lưu title mới
    const response = await putFlashcard(deckId, { title: newTitle });

    if (response.success) {
      // Cập nhật tiêu đề trong trạng thái local
      setFlashcards(
        flashcardsRef.current.map((deck) =>
          deck.id === deckId ? { ...deck, title: newTitle } : deck
        )
      );
      toast.success("Flashcard deck title updated successfully");
    } else {
      toast.error("Failed to update flashcard deck title");
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    setResourceToDelete(resourceId);
    setDeleteResourceDialogOpen(true);
  };

  const confirmDeleteResource = async () => {
    if (!resourceToDelete) return;

    loader.start();
    const response = await deleteResource(resourceToDelete);
    loader.setProgress(50);
    
    if (response.success === true) {
      setNotebook((prev) => ({
        ...prev,
        documents: prev.documents.filter((doc) => doc.id !== resourceToDelete),
        documentsCount: prev.documentsCount - 1,
      }));
      toast.success("Document deleted successfully");
    } else {
      toast.error("Failed to delete document");
    }

    loader.done();
    setDeleteResourceDialogOpen(false);
    setResourceToDelete(null);
  };

  // Check if any loading is in progress
  const isLoading =
    isLoadingNotebook ||
    isLoadingDocuments ||
    isLoadingMessages ||
    isLoadingFlashcards;

  return (
    <SidebarInset>
      <div className="h-auto">
        <NotebookHeader notebookTitle={notebook.title} />

        {isLoading ? (
          <LoadingNotebookDetail />
        ) : (
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
              handleDeleteResource={handleDeleteResource}
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
              onDeleteDeck={onDeleteDeck}
              isDisabled={isDisabled}
              onGenerateCustomFlashcards={onGenerateCustomFlashcards}
              onUpdateDeckTitle={onUpdateDeckTitle}
            />
          </div>
        )}

        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={handleUploadFiles}
        />

        {/* Delete Resource Confirmation Dialog */}
        <ConfirmDialog
          open={deleteResourceDialogOpen}
          onOpenChange={setDeleteResourceDialogOpen}
          title="Delete Document?"
          description="This action cannot be undone. This will permanently delete this document from your notebook."
          confirmText="Delete"
          cancelText="Cancel"
          variant="destructive"
          onConfirm={confirmDeleteResource}
          onCancel={() => setResourceToDelete(null)}
        />

        {/* Delete Flashcard Deck Confirmation Dialog */}
        <ConfirmDialog
          open={deleteDeckDialogOpen}
          onOpenChange={setDeleteDeckDialogOpen}
          title="Delete Flashcard Deck?"
          description="This action cannot be undone. This will permanently delete this flashcard deck and all its cards."
          confirmText="Delete"
          cancelText="Cancel"
          variant="destructive"
          onConfirm={confirmDeleteDeck}
          onCancel={() => setDeckToDelete(null)}
        />
      </div>
    </SidebarInset>
  );
};

export default NotebookDetailPage;
