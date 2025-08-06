import type { Message, Participant } from "../types/chat";
import { FileText, Download, Play } from "lucide-react";
import { useState } from "react";
import { formatFileSize, formatTime } from "../functions/utils";

interface MessageBubbleProps {
  message: Message;
  participant: Participant;
  isOwnMessage: boolean;
}

export default function MessageBubble({
  message,
  participant,
  isOwnMessage,
}: MessageBubbleProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const getRoleColor = (role: number): string => {
    switch (role) {
      case 0:
        return "text-purple-600"; // admin
      case 1:
        return "text-emerald-600"; // agent
      case 2:
        return "text-green-600"; // customer
      default:
        return "text-gray-600";
    }
  };

  const renderMediaContent = () => {
    if (!message.media) return null;

    switch (message.type) {
      case "image":
        return (
          <div className="mt-2">
            <img
              src={message.media.url}
              alt={message.media.alt || message.media.filename}
              className="max-w-full h-56 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(message.media?.url, "_blank")}
            />
            <div className="flex items-center justify-between mt-1 text-xs text-gray-300">
              <span>{message.media.filename}</span>
              <span>{formatFileSize(message.media.size)}</span>
            </div>
          </div>
        );

      case "video":
        return (
          <div className="mt-2">
            <div className="relative bg-gray-100 rounded-lg overflow-hidden">
              {isVideoPlaying ? (
                <video
                  src={message.media.url}
                  controls
                  autoPlay
                  className="w-72 h-48 object-cover"
                  onEnded={() => setIsVideoPlaying(false)}
                />
              ) : (
                <>
                  <img
                    src={message.media.thumbnail || message.media.url}
                    alt="Video thumbnail"
                    className="w-72 h-48 object-cover"
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
                    onClick={() => setIsVideoPlaying(true)}
                  >
                    <Play className="size-12 text-white" />
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
              <span>{message.media.filename}</span>
              <div className="flex gap-2">
                {message.media.duration && (
                  <span>
                    {Math.floor(message.media.duration / 60)}:
                    {(message.media.duration % 60).toString().padStart(2, "0")}
                  </span>
                )}
                <span>{formatFileSize(message.media.size)}</span>
              </div>
            </div>
          </div>
        );

      case "pdf":
        return (
          <div className="my-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-emerald-500" />
              <div className="flex-1">
                <div className="font-medium text-sm text-black">
                  {message.media.filename}
                </div>
                <div className="text-xs text-gray-500">
                  {message.media.pages} pages •{" "}
                  {formatFileSize(message.media.size)}
                </div>
              </div>
              <button
                onClick={() => window.open(message.media?.url, "_blank")}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <Download className="size-4" />
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-xs sm:max-w-md lg:max-w-lg ${
          isOwnMessage ? "order-2" : "order-1"
        }`}
      >
        {!isOwnMessage && (
          <div
            className={`text-xs font-medium mb-1 ${getRoleColor(
              participant.role
            )}`}
          >
            {participant.name}
          </div>
        )}
        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwnMessage
              ? "bg-emerald-500 text-white rounded-br-md"
              : "bg-gray-100 text-gray-800 rounded-bl-md"
          }`}
        >
          {message.message && <div className="text-sm">{message.message}</div>}
          {renderMediaContent()}
        </div>
        <div
          className={`text-xs text-gray-500 mt-1 ${
            isOwnMessage ? "text-right" : "text-left"
          }`}
        >
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
}
