export interface Participant {
  id: string;
  name: string;
  role: number; // 0: admin, 1: agent, 2: customer
}

export interface MediaContent {
  url: string;
  filename: string;
  size: number;
  alt?: string;
  duration?: number; // video
  thumbnail?: string; // video
  pages?: number; // document
}

export interface Message {
  id: number;
  type: "text" | "image" | "video" | "pdf";
  message: string;
  sender: string;
  timestamp: string;
  media?: MediaContent;
}

export interface Room {
  name: string;
  id: number;
  image_url: string;
  participant: Participant[];
}

export interface ChatData {
  results: Array<{
    room: Room;
    comments: Message[];
  }>;
}
