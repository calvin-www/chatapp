"use client";
import React, { useState, useCallback } from "react";
import Chat from "./components/Chat";
import ChatTable from "./components/ChatTable";
import { createConversation } from "@/app/utils/firestore";
import { auth } from "@/app/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

export default function Home() {
  const [user] = useAuthState(auth);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [newConversationTrigger, setNewConversationTrigger] = useState(0);
  const [titleChangeTrigger, setTitleChangeTrigger] = useState(0);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
  };
  const handleTitleChange = useCallback(() => {
    setTitleChangeTrigger((prev) => prev + 1);
  }, []);
  const handleCreateNewChat = async () => {
    if (user) {
      try {
        const newConversationId = await createConversation(user.uid);
        setSelectedConversation(newConversationId);
        setNewConversationTrigger((prev) => prev + 1);
      } catch (error) {
        console.error("Error creating new conversation:", error);
      }
    } else {
      console.error("User not authenticated");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-3xl font-bold mb-8">This is a real guy trust me</h1>
      <div className="w-full max-w-6xl flex gap-8">
        <div className="w-1/3">
          <ChatTable
            onSelectConversation={handleSelectConversation}
            onCreateNewChat={handleCreateNewChat}
            selectedConversationId={selectedConversation}
            newConversationTrigger={newConversationTrigger}
            titleChangeTrigger={titleChangeTrigger}
          />
        </div>
        <div className="w-2/3">
          {selectedConversation ? (
            <Chat
              conversationId={selectedConversation}
              onTitleChange={handleTitleChange}
            />
          ) : (
            <div className="text-center text-gray-500">
              Select a conversation or create a new one to start chatting
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
