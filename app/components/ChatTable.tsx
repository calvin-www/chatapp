"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Button,
  Tooltip,
} from "@nextui-org/react";
import { auth } from "@/app/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  getUserConversations,
  getMessages,
  deleteConversation,
} from "@/app/utils/firestore";
import { Trash2 } from "lucide-react";

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

interface ChatTableProps {
  onSelectConversation: (conversationId: string) => void;
  onCreateNewChat: () => void;
  onDeleteConversation: (conversationId: string) => void;
  selectedConversationId: string | null;
  newConversationTrigger: number;
  titleChangeTrigger: number;
}

const ChatTable: React.FC<ChatTableProps> = ({
  onSelectConversation,
  onCreateNewChat,
  onDeleteConversation,
  selectedConversationId,
  newConversationTrigger,
  titleChangeTrigger,
}) => {
  const [user] = useAuthState(auth);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const fetchConversations = useCallback(async () => {
    if (user) {
      try {
        const data = await getUserConversations(user.uid);
        setConversations(data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchConversations();
  }, [user, newConversationTrigger, titleChangeTrigger, fetchConversations]);

  const truncateMessage = (message: string, maxLength: number = 30) => {
    return message.length > maxLength
      ? message.substring(0, maxLength) + "..."
      : message;
  };

  const handleDelete = async (conversationId: string) => {
    try {
      await deleteConversation(conversationId);
      await fetchConversations();
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  return (
    <div className="bg-[#1F2937] text-gray-100 p-4 rounded-xl w-full overflow-x-auto">
      <Button
        onClick={onCreateNewChat}
        radius='md'
        className="mb-4 w-full text-white font-bold py-2 px-4 transition-all duration-300 ease-in-out bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-500 hover:from-blue-500 hover:via-cyan-500 hover:to-blue-600 shadow-lg hover:shadow-cyan-500/50"
      >
        Create New Chat
      </Button>
      <div className="max-h-[400px] overflow-y-auto">
        <Table
          aria-label="Conversations table"
          selectionMode="single"
          selectedKeys={
            selectedConversationId
              ? new Set([selectedConversationId])
              : new Set()
          }
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0] as string;
            onSelectConversation(selectedKey);
          }}
          classNames={{
            base: "w-full min-w-full p-0 rounded-3xl",
            table: "min-w-full bg-[#1F2937] p-0",
            th: "bg-gray-800 text-cyan-400 sticky top-0",
            td: "text-gray-100 bg-gray-700",
            tr: "border-b border-gray-800",
            wrapper: "shadow-none p-0 rounded-xl",
          }}
        >
          <TableHeader>
            <TableColumn>TITLE</TableColumn>
            <TableColumn>DATE</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {conversations.map((conversation) => (
              <TableRow key={conversation.id}>
                <TableCell>{conversation.title}</TableCell>
                <TableCell>{conversation.timestamp.toLocaleString()}</TableCell>
                <TableCell>
                  <Tooltip
                    content="Delete conversation"
                    className="bg-[#EF4444]"
                  >
                    <Button
                      isIconOnly
                      variant="light"
                      onPress={() => handleDelete(conversation.id)}
                      className="text-red-500 hover:bg-gray-700"
                    >
                      <Trash2 size={20} />
                    </Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ChatTable;
