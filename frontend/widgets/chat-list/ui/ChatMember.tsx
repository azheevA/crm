import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

interface Props {
  members: {
    id: number;
    name: string;
    avatar?: { url: string };
  }[];
}

export const ChatMembers = ({ members }: Props) => {
  return (
    <div className="flex -space-x-2 overflow-hidden py-2">
      <TooltipProvider>
        {members.map((member) => (
          <Tooltip key={member.id}>
            <TooltipTrigger asChild>
              <Avatar className="inline-block border-2 border-white w-8 h-8">
                <AvatarImage src={member.avatar?.url} />
                <AvatarFallback>
                  {member.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{member.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
      {members.length > 5 && (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 border-2 border-white text-xs font-medium text-gray-500">
          +{members.length - 5}
        </div>
      )}
    </div>
  );
};
