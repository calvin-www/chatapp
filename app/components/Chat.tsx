'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Card, Input, Button } from "@nextui-org/react"
import { createConversation, saveMessage, getMessages } from '@/app/utils/firestore'
import { auth } from '@/app/utils/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import SignIn from './SignIn'

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [user] = useAuthState(auth)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user && !conversationId) {
      createConversation(user.uid)
          .then(id => setConversationId(id))
          .catch(error => console.error('Error creating conversation:', error));
    }
  }, [user, conversationId]);

  useEffect(() => {
    if (conversationId) {
      getMessages(conversationId)
          .then(setMessages)
          .catch(error => console.error('Error fetching messages:', error));
    }
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (input.trim() && user && conversationId) {
      const userMessage: Message = { text: input, sender: 'user' };
      setMessages(prevMessages => [...prevMessages, userMessage])
      setInput('')
      setIsLoading(true)

      try {
        await saveMessage(conversationId, userMessage);

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: input,
            conversationHistory: messages.map(msg => `${msg.sender === 'user' ? 'Human' : 'AI'}: ${msg.text}`).join('\n')
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('Response body is not readable');
        }

        let aiReply = '';
        const aiMessage: Message = { text: aiReply, sender: 'ai' };
        setMessages(prevMessages => [...prevMessages, aiMessage]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = new TextDecoder().decode(value);
          aiReply += chunk;
          setMessages(prevMessages => 
            prevMessages.map((msg, index) => 
              index === prevMessages.length - 1 ? { ...msg, text: aiReply } : msg
            )
          );
        }

        await saveMessage(conversationId, { text: aiReply, sender: 'ai' });
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!user) {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl mb-4">Welcome to the Chat App</h1>
          <p className="mb-4">Please sign in to start chatting.</p>
          <SignIn />
        </div>
    );
  }

  return (
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2>Welcome, {user.displayName}</h2>
          <Button onClick={() => auth.signOut()}>Sign Out</Button>
        </div>
        <div className="h-96 overflow-y-auto mb-4">
          {messages.map((message, index) => (
            <div key={index} className={`mb-2 ${message.sender === 'user' ? 'flex justify-end' : 'flex justify-start'}`}>
              <div className={`max-w-xs rounded-lg p-3 ${
                message.sender === 'user' 
                  ? 'bg-primary text-white rounded-br-none' 
                  : 'bg-gray-200 text-black rounded-bl-none'
              }`}>
                {message.text}
              </div>
            </div>
          ))}
          {isLoading && <div className="text-center">AI is typing...</div>}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-grow mr-2"
          />
          <Button onClick={handleSend} disabled={isLoading}>Send</Button>
        </div>
      </Card>
  )
}

export default Chat