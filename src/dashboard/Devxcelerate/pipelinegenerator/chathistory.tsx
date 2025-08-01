"use client";

import React, { useState } from "react";
import { Trash, X, History } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
export interface ChatItem {
  question: string;
  answer: string | React.ReactElement;
}


export interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[]; // Not ChatItem[]
  createdAt: string;
}

interface ChatHistorySidebarProps {
  chatSessions: ChatSession[];
  onClose: () => void;
  onDelete: (id: string) => void;
  onSelectSession: (id: string) => void;
}

export default function ChatHistorySidebar({
  chatSessions,
  onClose,
  onDelete,
  onSelectSession,
}: ChatHistorySidebarProps) {
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null);

  return (
    <div className="fixed top-38 right-5 z-50 h-[55vh] w-70 bg-[#0D0D0D] border border-[#3e3e3e] flex flex-col rounded-[10px]">
      <header className="flex items-center py-3 border-b border-[#3e3e3e]">
        <History size={"17px"} className="ml-2" />
        <h3 className="text-sm text-white ml-2">Chat History</h3>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{ cursor: "pointer", marginLeft: "110px" }}
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto space-y-2 px-2 pb-4 mt-2">
        {chatSessions.length === 0 ? (
          <p className="text-sm text-gray-400">No chat sessions yet.</p>
        ) : (
          chatSessions.map((session) => (
            <div
              key={session.id}
              className="flex justify-between items-center text-sm text-gray-300 bg-[#3e3e3e] p-2 rounded-lg hover:bg-[#4e4e4e] transition-colors cursor-pointer"
            >
              <div
                className="cursor-pointer"
                onClick={() => onSelectSession(session.id)}
              >
                {
  session.messages.find(msg => msg.sender === 'user')?.text.slice(0, 40) || 'Untitled Chat'
}

              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteSessionId(session.id);
                }}
                className="text-gray-400 "
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

    

      {deleteSessionId && (
        <Dialog open={!!deleteSessionId} onOpenChange={(open) => !open && setDeleteSessionId(null)}>
  <DialogContent className="bg-[#1a1a1a] border-[#3e3e3e] text-sm text-white sm:max-w-[320px] rounded-2xl">
    <DialogHeader>
      <p className="text-sm">
        Are you sure you want to delete this conversation?
      </p>
    </DialogHeader>

    <DialogFooter className="flex justify-end space-x-3">
      <button
        onClick={() => setDeleteSessionId(null)}
        className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
      >
        Cancel
      </button>
      <button
        onClick={() => {
          onDelete(deleteSessionId);
          setDeleteSessionId(null);
          onClose();
        }}
        className="px-3 py-1 bg-red-600 rounded hover:bg-red-500"
      >
        Delete
      </button>
    </DialogFooter>
  </DialogContent>
</Dialog>
      )}
    </div>
  );
}
