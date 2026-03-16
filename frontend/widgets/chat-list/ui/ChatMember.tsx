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
  const visible = members.slice(0, 5);
  const rest = members.length - 5;

  return (
    <TooltipProvider>
      <div className="flex items-center py-2">
        <div className="flex -space-x-3">
          {visible.map((member) => (
            <Tooltip key={member.id}>
              <TooltipTrigger asChild>
                <Avatar
                  className="
                  h-8 w-8
                  border border-white/20
                  backdrop-blur
                  bg-white/30 dark:bg-white/5
                  shadow-[0_0_10px_rgba(0,0,0,0.15)]
                  hover:scale-110
                  transition
                "
                >
                  <AvatarImage src={member.avatar?.url} />
                  <AvatarFallback>
                    {member.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>

              <TooltipContent side="bottom">{member.name}</TooltipContent>
            </Tooltip>
          ))}

          {rest > 0 && (
            <div
              className="
              flex items-center justify-center
              h-8 w-8
              rounded-full
              text-xs font-medium
              border border-white/20
              bg-white/30 dark:bg-white/5
              backdrop-blur
            "
            >
              +{rest}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};
