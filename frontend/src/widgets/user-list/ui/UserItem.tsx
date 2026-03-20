import { UserDto } from "@/src/shared/api/model";
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
      className={`p-2  cursor-pointer rounded-2xl border-2  ${selected ? " border-gray-900 bg-gray-400 dark:bg-gray-800 dark:border-white" : "border-transparent"}`}
    >
      <div className="flex items-center gap-2 p-2 border-b cursor-pointer dark:hover:border-white">
        {user.avatar && (
          <Image
            src={`http://localhost:3000${user.avatar.url}`}
            className="w-8 h-8 rounded-full"
            alt="not founded"
            height={50}
            width={50}
            unoptimized
          />
        )}
        <span className="">{user.name ?? user.email}</span>
      </div>
    </div>
  );
};
