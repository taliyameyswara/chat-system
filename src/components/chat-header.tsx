import type { Room } from "../types/chat";

interface ChatHeaderProps {
  room: Room;
}

export default function ChatHeader({ room }: ChatHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
      <img
        src={room.image_url}
        alt={room.name}
        className="size-10 rounded-full object-cover"
      />
      <div>
        <h2 className="font-semibold text-gray-900">{room.name}</h2>
        <p className="text-sm text-gray-500">
          {room.participant.length} participants
        </p>
      </div>
    </div>
  );
}
