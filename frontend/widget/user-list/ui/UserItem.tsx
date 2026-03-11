import { UserDto } from "@/shared/api/model";
import Image from "next/image";
interface Props {
  user: UserDto;
  selected: boolean;
  onSelect: (userId: number) => void;
}

export const UserItem = ({ user, selected, onSelect }: Props) => {
  return (
    <div
      onClick={() => onSelect(user.id)}
      className={`p-2 border-b cursor-pointer ${selected ? "bg-blue-100" : ""}`}
    >
      <div className="flex items-center gap-2 p-2 border-b cursor-pointer">
        {user.avatar && (
          <Image
            src={user.avatar.url}
            className="w-8 h-8 rounded-full"
            alt="not founded"
            height={50}
            width={50}
          />
        )}

        <span>{user.name ?? user.email}</span>
      </div>
    </div>
  );
};
