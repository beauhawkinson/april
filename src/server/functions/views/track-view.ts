import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import { redis } from "@/lib/redis";

export const trackView = createServerFn({ method: "POST" }).handler(async () => {
  const headers = getRequestHeaders();
  const ip = headers.get("x-forwarded-for") ?? headers.get("x-real-ip");
  const blocked = process.env.BLOCKED_IPS?.split(",").map((s) => s.trim()) ?? [];
  const isDev = process.env.NODE_ENV === "development";
  const isMe = isDev || (ip !== null && blocked.includes(ip));

  if (!isMe) {
    await redis.hincrby("pageviews", "april", 1);
  }

  const count = await redis.hget("pageviews", "april");
  return { count };
});
