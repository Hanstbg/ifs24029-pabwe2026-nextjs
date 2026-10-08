import fs from "node:fs";
import path from "node:path";

function parseEnvValue(content: string, key: string): string | undefined {
  for (const line of content.split(/\r?\n/)) {
    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) continue;
    if (line.slice(0, separatorIndex).trim() === key) {
      const value = line.slice(separatorIndex + 1).trim();
      if (value) return value;
    }
  }
  return undefined;
}

function getPort(): string {
  if (process.env.APP_PORT) return process.env.APP_PORT.trim();
  if (process.env.PORT) return process.env.PORT.trim();

  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, "utf-8");
      const port = parseEnvValue(content, "APP_PORT") ?? parseEnvValue(content, "PORT");
      if (port) return port;
    } catch {
      // fallback jika file .env tidak dapat dibaca
    }
  }

  return "3000";
}

const action = process.argv[2] || "dev";
const port = getPort();

const nextArgs = action === "start" ? ["start", "-p", port] : ["dev", "--turbopack", "-p", port];

process.env.PORT = port;
process.env.APP_PORT = port;

// Jalankan CLI Next.js di dalam proses yang sama (tanpa child process).
process.argv = [process.argv[0], "next", ...nextArgs];
require("next/dist/bin/next");