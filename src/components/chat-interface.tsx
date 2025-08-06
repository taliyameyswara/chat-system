import { useState, useEffect, useRef } from "react";
import type { ChatData, Message, Participant } from "../types/chat";
import ChatHeader from "./chat-header";
import MessageInput from "./message-input";
import MessageBubble from "./message-bubble";

interface ChatInterfaceProps {
  chatData: ChatData;
  currentUserId?: string;
}

export default function ChatInterface({
  chatData,
  currentUserId = "customer@mail.com",
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatData.results.length > 0) {
      const firstResult = chatData.results[0];
      setMessages(firstResult.comments);
      setParticipants(firstResult.room.participant);
    }
  }, [chatData]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (
    messageText: string,
    file?: File,
    thumbnailUrl?: string
  ) => {
    const newMessage: Message = {
      id: Date.now(),
      type: file ? getMessageType(file) : "text",
      message: messageText || "",
      sender: currentUserId,
      timestamp: new Date().toISOString(),
      ...(file && {
        media: {
          url: URL.createObjectURL(file),
          filename: file.name,
          size: file.size,
          alt: file.name,
          ...(file.type.startsWith("video/") && {
            thumbnail: thumbnailUrl || URL.createObjectURL(file),
            duration: 0,
          }),
          ...(file.type === "application/pdf" && {
            pages: 1,
          }),
        },
      }),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const getMessageType = (file: File): "text" | "image" | "video" | "pdf" => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    if (file.type === "application/pdf") return "pdf";
    return "text";
  };

  const getParticipant = (senderId: string): Participant => {
    return (
      participants.find((p) => p.id === senderId) || {
        id: senderId,
        name: "King Customer",
        role: 2,
      }
    );
  };

  if (chatData.results.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600">
            No chat data available
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <ChatHeader room={chatData.results[0].room} />

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.map((message) => {
          const participant = getParticipant(message.sender);
          const isOwnMessage = message.sender === currentUserId;

          return (
            <MessageBubble
              key={message.id}
              message={message}
              participant={participant}
              isOwnMessage={isOwnMessage}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}
