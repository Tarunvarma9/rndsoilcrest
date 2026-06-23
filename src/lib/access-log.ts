import "server-only";
import { Redis } from "@upstash/redis";
import type { LogEntry } from "./access-log-types";

export type { LogEntry };
export { parseUA, maskIP, timeAgo } from "./access-log-types";

const KV_KEY  = "sc:access_log";
const MAX_LOGS = 500;

function getRedis(): Redis | null {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function appendLog(entry: LogEntry): Promise<void> {
  try {
    const redis = getRedis();
    if (!redis) return;
    await redis.lpush(KV_KEY, JSON.stringify(entry));
    await redis.ltrim(KV_KEY, 0, MAX_LOGS - 1);
  } catch {
    // Redis unreachable — silent no-op
  }
}

export async function getLogs(limit = 200): Promise<LogEntry[]> {
  try {
    const redis = getRedis();
    if (!redis) return [];
    const raw = await redis.lrange<string>(KV_KEY, 0, limit - 1);
    return raw.map((item) =>
      typeof item === "string" ? (JSON.parse(item) as LogEntry) : (item as unknown as LogEntry)
    );
  } catch {
    return [];
  }
}

export async function clearLogs(): Promise<void> {
  try {
    const redis = getRedis();
    if (!redis) return;
    await redis.del(KV_KEY);
  } catch {
    // no-op
  }
}
