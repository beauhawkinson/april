import { env } from "@/lib/config/t3.config";

export const redis = {
  async hincrby(key: string, field: string, increment: number): Promise<number | null> {
    try {
      const res = await fetch(
        `${env.UPSTASH_REDIS_REST_URL}/hincrby/${key}/${field}/${increment}`,
        { headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}` } },
      );
      const data = (await res.json()) as { result?: unknown };
      return typeof data.result === "number" ? data.result : null;
    } catch (err) {
      console.error("Redis hincrby error:", err);
      return null;
    }
  },

  async hget(key: string, field: string): Promise<number | null> {
    try {
      const res = await fetch(`${env.UPSTASH_REDIS_REST_URL}/hget/${key}/${field}`, {
        headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}` },
      });
      const data = (await res.json()) as { result?: unknown };
      const val = Number(data.result);
      return Number.isNaN(val) ? null : val;
    } catch (err) {
      console.error("Redis hget error:", err);
      return null;
    }
  },
};
