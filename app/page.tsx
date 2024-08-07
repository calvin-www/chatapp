"use client";
import React, { useState, useCallback } from "react";
import Chat from "./components/Chat";
import ChatTable from "./components/ChatTable";
import { deleteConversation } from "@/app/utils/firestore";
import { auth } from "@/app/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import FeedbackForm from "./components/FeedbackForm";
import { Button } from "@nextui-org/react";
interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

export default function Home() {
  const [user] = useAuthState(auth);
  const [selectedConversation, setSelectedConversation] = useState<string>("temp-" + Date.now());
  const [newConversationTrigger, setNewConversationTrigger] = useState(0);
  const [titleChangeTrigger, setTitleChangeTrigger] = useState(0);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
  };

  const handleTitleChange = useCallback(() => {
    setTitleChangeTrigger((prev) => prev + 1);
  }, []);

  const handleCreateNewChat = () => {
    const tempId = "temp-" + Date.now();
    setSelectedConversation(tempId);
    setNewConversationTrigger((prev) => prev + 1);
  };

  const handleFeedbackSubmit = (feedback: {
    rating: string | null;
    comment: string;
  }) => {
    console.log("Feedback received:", feedback);
  };
  const handleDelete = async (conversationId: string) => {
    try {
      await deleteConversation(conversationId);
      if (selectedConversation === conversationId) {
        // If the deleted conversation was selected, create a new temporary conversation
        const tempId = "temp-" + Date.now();
        setSelectedConversation(tempId);
      }
      setNewConversationTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-3xl font-bold mb-8">This is a real guy trust me</h1>
      <div className="w-full max-w-6xl flex gap-8 bg-">
        <div className=" w-1/3 ">
          <ChatTable
              onSelectConversation={handleSelectConversation}
              onCreateNewChat={handleCreateNewChat}
              onDeleteConversation={handleDelete}
              selectedConversationId={selectedConversation}
              newConversationTrigger={newConversationTrigger}
              titleChangeTrigger={titleChangeTrigger}
          />
        </div>
        <div className="w-2/3">
          <Chat
            conversationId={selectedConversation}
            onTitleChange={handleTitleChange}
            isNewConversation={selectedConversation.startsWith("temp-")}
            onNewConversationCreated={(newId) => setSelectedConversation(newId)}
          />
        </div>
      </div>
      <Button
        className="fixed bottom-4 right-4 rounded-full"
        onClick={() => setIsFeedbackModalOpen(true)}
      >
        Feedback
      </Button>
      <FeedbackForm
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmit={handleFeedbackSubmit}
      />
    </main>
  );
}