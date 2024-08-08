"use client";
import React, { useState, useCallback } from "react";
import Chat from "./components/Chat";
import ChatTable from "./components/ChatTable";
import { deleteConversation } from "@/app/utils/firestore";
import { auth } from "@/app/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import FeedbackForm from "./components/FeedbackForm";
import { Button } from "@nextui-org/react";
import SignIn from "./components/SignIn";

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const [selectedConversation, setSelectedConversation] = useState<string>(
    "temp-" + Date.now(),
  );
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
    rating: number;
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
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <SignIn />
      </div>
    );
  }
  return (
    <main className="flex min-h-screen flex-col items-center p-24 relative">
      <div className="absolute inset-0 z-0 bg-[#161517]">
        <svg
          className="w-full h-full svg-color)"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <image
            href="/images/topography.svg"
            width="100%"
            height="100%"
            preserveAspectRatio="none"
          />
        </svg>
      </div>
      <div className="relative z-10">
        <h1 className="text-3xl font-bold mb-8">Customer Support Chat</h1>
        <div className="w-full max-w-6xl flex gap-8 bg-">
          <div className=" w-1/3 min-w-[300px]">
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
              isNewConversation={
                selectedConversation?.startsWith("temp-") ?? false
              }
              onNewConversationCreated={(newId) =>
                setSelectedConversation(newId)
              }
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
      </div>
    </main>
  );
}
