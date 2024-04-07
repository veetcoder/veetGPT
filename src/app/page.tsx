"use client";

import { useChat } from "ai/react";
import { handler } from "./actions";
import { BubbleMessage } from "@/components/bubble-message";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

export default function Page() {
  const { toast } = useToast();
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      api: handler,
    });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  }, [error, toast]);

  return (
    <div className="flex flex-col h-full grow items-center m-6 mb-0 relative">
      <div className="max-w-7xl flex flex-col h-full grow rounded w-full overflow-clip">
        {messages.length == 0 ? (
          <div className="grow flex items-center justify-center">
            <h2 className="text-xl text-center font-bold">
              Send a message to start chatting!
            </h2>
          </div>
        ) : (
          <ul className="grow flex flex-col gap-4 p-4">
            {messages.map((m, index) => (
              <li key={index}>
                <BubbleMessage message={m} />
              </li>
            ))}
          </ul>
        )}
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 bg-background sticky bottom-0 p-4"
        >
          <Input
            type="text"
            placeholder="Enter message"
            onChange={handleInputChange}
            value={input}
            autoFocus
            maxLength={1000}
          />
          <Button type="submit" disabled={isLoading}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
