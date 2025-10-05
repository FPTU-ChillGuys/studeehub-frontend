"use client";

import React, { useState } from "react";
import { X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreateNotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, description?: string, thumbnail?: string) => void;
}

const CreateNotebookModal: React.FC<CreateNotebookModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedThumbnail, setSelectedThumbnail] = useState("📚");

  const thumbnailOptions = [
    "💡",
    "🔭",
    "🧩",
    "🧬",
    "🧠",
    "🎨",
    "✨",
    "🪄",
    "💻",
    "⚙️",
    "🔧",
    "🔨",
    "🛠️",
    "🧱",
    "🧮",
    "🧰",
    "🗃️",
    "📡",
    "📚",
    "📘",
    "🧾",
    "🗒️",
    "🗂️",
    "🧷",
    "🔖",
    "🗓️",
    "🧭",
    "📊",
    "📈",
    "🪜",
    "📋",
    "🌐",
    "👥",
    "🏢",
    "🤝",
    "🗣️",
    "📣",
    "🧪",
    "🚧",
    "⚗️",
    "🚀",
    "🔒",
    "🧿",
    "🕵️‍♂️",
    "🔐",
    "�",
    "📝",
    "🤖",
    "🎯",
    "🎲",
    "🎪",
    "🔎",
    "💭",
    "🧘‍♂️",
    "📱",
    "🌱",
    "🏗️",
    "🪶",
    "🛡️",
    "🎊",
  ];

  if (!isOpen) return null;

  const handleCreate = () => {
    if (title.trim()) {
      onCreate(
        title.trim(),
        description.trim() || undefined,
        selectedThumbnail
      );
      // Reset form
      setTitle("");
      setDescription("");
      setSelectedThumbnail("📝");
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleCreate();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-background border border-border rounded-xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-foreground">
              Create New Notebook
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(85vh-160px)]">
          {/* Thumbnail Selection */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Choose an icon
            </label>
            <div className="grid grid-cols-12 gap-2 max-h-40 overflow-y-auto p-3 border border-border rounded-lg bg-muted/20">
              {thumbnailOptions.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedThumbnail(emoji)}
                  className={`p-2 text-xl hover:bg-accent rounded transition-colors ${
                    selectedThumbnail === emoji
                      ? "bg-primary/20 ring-2 ring-primary"
                      : ""
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Title Input */}
            <div>
              <label
                htmlFor="title"
                className="text-sm font-medium text-foreground mb-2 block"
              >
                Notebook Title *
              </label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter notebook title..."
                className="w-full"
                autoFocus
              />
            </div>

            {/* Preview */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Preview
              </label>
              <div className="bg-muted/50 border border-border rounded-lg p-4 h-[42px] flex items-center">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{selectedThumbnail}</div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">
                      {title || "Notebook Title"}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description Input */}
          <div>
            <label
              htmlFor="description"
              className="text-sm font-medium text-foreground mb-2 block"
            >
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Describe what this notebook is about..."
              className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground resize-none"
              rows={2}
            />
          </div>

          {/* Enhanced Preview */}
          <div className="bg-gradient-to-br from-muted/30 to-muted/60 border border-border rounded-lg p-5">
            <p className="text-sm font-medium text-muted-foreground mb-4">
              Preview:
            </p>
            <div className="flex items-start gap-4">
              <div className="text-4xl">{selectedThumbnail}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-lg mb-1">
                  {title || "Notebook Title"}
                </h3>
                {description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full"></span>
                    0 documents
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full"></span>
                    0 questions
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full"></span>
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-muted/20">
          <div className="flex justify-between items-center p-6">
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <span className="text-sm">💡</span>
              Tip: Press Ctrl+Enter to create, Escape to cancel
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={!title.trim()}>
                <FileText className="w-4 h-4 mr-2" />
                Create Notebook
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNotebookModal;
