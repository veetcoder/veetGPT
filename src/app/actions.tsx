"use server";

import MistralClient from "@mistralai/mistralai";
import { Ratelimit } from "@upstash/ratelimit";
import { MistralStream, Message, StreamingTextResponse } from "ai";
import { headers } from "next/headers";
import { kv } from "@vercel/kv";

const client = new MistralClient(process.env.MISTRAL_API_KEY);

export async function handler({ messages }: { messages: Message[] }) {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const ip = headers().get("x-forwarded-for");
    const ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(1, "5s"),
    });

    const { success } = await ratelimit.limit(`ratelimit_${ip}`);

    if (!success) {
      throw new Error("You have reached your request limit for the day.");
    }
  }

  const response = client.chatStream({
    model: "mistral-tiny",
    maxTokens: 1000,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const stream = MistralStream(response);

  return new StreamingTextResponse(stream);
}
