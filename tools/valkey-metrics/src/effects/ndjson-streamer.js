import fs from "node:fs";
import readline from "node:readline";
import path from "node:path";
import { ymd } from "../utils/helpers.js";

const DATA_DIR = process.env.METRICS_DIR || path.resolve(process.cwd(), "data");

const fileFor = (prefix, date) => path.join(DATA_DIR, `${prefix}_${ymd(date)}.ndjson`);

export async function streamNdjson(prefix) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const files = [fileFor(prefix, yesterday), fileFor(prefix, today)];
  const results = [];

  for (const file of files) {
    if (!fs.existsSync(file)) continue;

    const fileStream = fs.createReadStream(file, { encoding: "utf8" });
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    for await (const line of rl) {
      if (!line.trim()) continue;
      try {
        results.push(JSON.parse(line));
      } catch {
        // ignore bad lines
      }
    }
  }

  return results; // JSON array of all objects
}

export const [memory_stats, info_cpu, slowlog_len, slowlog_get, monitor] =
  ['memory', 'cpu', 'slowlog_len', 'slowlog', 'monitor'].map(filePrefix => () => readTwoDaysRows(filePrefix))