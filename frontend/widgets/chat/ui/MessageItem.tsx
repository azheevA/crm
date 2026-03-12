import { MessageDto } from "@/shared/api/model";

interface Props {
  message: MessageDto;
}

export const MessageItem = ({ message }: Props) => {
  return (
    <div className="flex gap-2">
      <div className="font-semibold">{message.author.name}</div>

      <div className="bg-gray-100 px-3 py-2 rounded-lg">{message.text}</div>
    </div>
  );
};
