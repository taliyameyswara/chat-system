import { useState, useEffect } from "react";

import type { ChatData } from "./types/chat";
import ChatInterface from "./components/chat-interface";
import LoadingSpinner from "./components/spinner";

export default function App() {
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChatData = async () => {
      try {
        const response = await fetch("/data/conversation-extended.json");
        if (!response.ok) {
          throw new Error("Failed to load chat data");
        }
        const data: ChatData = await response.json();
        setChatData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadChatData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !chatData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error || "Failed to load chat data"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen font-inter">
      <ChatInterface chatData={chatData} currentUserId="customer@mail.com" />
    </div>
  );
}
