'use client'
import React, { useEffect, useState, useCallback } from 'react';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Button, Tooltip } from "@nextui-org/react";
import { auth } from '@/app/utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getUserConversations, getMessages, deleteConversation } from '@/app/utils/firestore';
import { Trash2 } from 'lucide-react';

interface Conversation {
    id: string;
    title: string;
    lastMessage: string;
    timestamp: Date;
}

interface ChatTableProps {
  onSelectConversation: (conversationId: string) => void;
  onCreateNewChat: () => void;
  selectedConversationId: string | null;
  newConversationTrigger: number;
  titleChangeTrigger: number;
}

const ChatTable: React.FC<ChatTableProps> = ({
                                                 onSelectConversation,
                                                 onCreateNewChat,
                                                 selectedConversationId,
                                                 newConversationTrigger,
                                                 titleChangeTrigger
                                             }) => {
  const [user] = useAuthState(auth);
  const [conversations, setConversations] = useState<Conversation[]>([]);

const fetchConversations = useCallback(async () => {
  if (user) {
    try {
      const data = await getUserConversations(user.uid);
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  }
},[user]);

useEffect(() => {
  fetchConversations();
}, [user, newConversationTrigger, titleChangeTrigger, fetchConversations]);



  const truncateMessage = (message: string, maxLength: number = 30) => {
    return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
  };

  const handleDelete = async (conversationId: string) => {
    try {
      await deleteConversation(conversationId);
      await fetchConversations();
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  return (
    <div>
      <Button onClick={onCreateNewChat} className="mb-4 w-full">
        Create New Chat
      </Button>
<Table 
  aria-label="Conversations table"
  selectionMode="single"
  selectedKeys={selectedConversationId ? new Set([selectedConversationId]) : new Set()}
  onSelectionChange={(keys) => {
    const selectedKey = Array.from(keys)[0] as string;
    onSelectConversation(selectedKey);
  }}
>
        <TableHeader>
          <TableColumn>TITLE</TableColumn>
          <TableColumn>LAST MESSAGE</TableColumn>
          <TableColumn>DATE</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {conversations.map((conversation) => (
            <TableRow key={conversation.id}>
              <TableCell>{conversation.title}</TableCell>
              <TableCell>{truncateMessage(conversation.lastMessage)}</TableCell>
              <TableCell>{conversation.timestamp.toLocaleString()}</TableCell>
              <TableCell>
                <Tooltip content="Delete conversation">
                  <Button 
                    isIconOnly 
                    color="danger" 
                    variant="light" 
                    onPress={() => handleDelete(conversation.id)}
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
  );
};

export default ChatTable;