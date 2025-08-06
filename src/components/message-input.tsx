import { useState, useRef } from "react";
import { Send, Paperclip, X } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string, file?: File, thumbnailUrl?: string) => void;
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      video.addEventListener("loadedmetadata", () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        video.currentTime = 1; // frame at 1 second
      });

      video.addEventListener("seeked", () => {
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnailUrl = canvas.toDataURL("image/jpeg", 0.8);
          resolve(thumbnailUrl);
        }
      });

      video.src = URL.createObjectURL(file);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || selectedFile) {
      onSendMessage(
        message.trim(),
        selectedFile || undefined,
        thumbnailUrl || undefined
      );
      setMessage("");
      clearFile();
    }
  };

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    if (file.type.startsWith("video/")) {
      try {
        const thumbnail = await generateVideoThumbnail(file);
        setThumbnailUrl(thumbnail);
      } catch (error) {
        console.error("Error generating thumbnail:", error);
      }
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }
    setThumbnailUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getFileType = (file: File): "image" | "video" | "pdf" | "file" => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    if (file.type === "application/pdf") return "pdf";
    return "file";
  };

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-3">
      {selectedFile && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getFileType(selectedFile) === "image" && previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              {getFileType(selectedFile) === "video" && (
                <img
                  src={thumbnailUrl || previewUrl}
                  alt="Video preview"
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div>
                <div className="text-sm font-medium">{selectedFile.name}</div>
                <div className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            </div>
            <button
              onClick={clearFile}
              className="p-1 hover:bg-gray-200 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="flex gap-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="*/*"
            onChange={(e) =>
              e.target.files?.[0] && handleFileSelect(e.target.files[0])
            }
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Paperclip className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={!message.trim() && !selectedFile}
          className="p-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
