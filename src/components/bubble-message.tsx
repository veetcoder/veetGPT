import { cn } from "@/lib/utils";
import { Message } from "ai";

export function BubbleMessage({ message }: { message: Message }) {
  return (
    <div
      className={cn("flex", {
        "justify-start": message.role !== "user",
        "justify-end": message.role === "user",
      })}
    >
      <div
        className={cn("px-4 py-2 rounded text-sm", {
          "bg-neutral-800 text-foreground": message.role !== "user",
          "bg-neutral-200 text-background": message.role === "user",
        })}
      >
        {message.content}
      </div>
    </div>
  );
}
