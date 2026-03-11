"use client";

import { useUserControllerFindAll } from "@/shared/api/endpoints/users/users";
import { UserItem } from "./UserItem";
import { useCurrentUser } from "@/entities/user/hooks/useCurrentUser";
interface Props {
  onSelect: (userId: number) => void;
  selected: number[];
}

export const UserList = ({ onSelect, selected }: Props) => {
  const { data, isLoading } = useUserControllerFindAll();
  const { user: me } = useCurrentUser();
  const users = data?.filter((u) => u.id !== me?.id);

  if (isLoading) return <div>Загрузка пользователей...</div>;

  return (
    <div className="flex flex-col max-h-60 overflow-y-auto">
      {users?.map((user) => (
        <UserItem
          key={user.id}
          user={user}
          selected={selected.includes(user.id)}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};
