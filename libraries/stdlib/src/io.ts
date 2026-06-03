import fs from "node:fs";
import path from "node:path";
import { Parser, type ParserOptions } from "@json2csv/plainjs";

type CsvFields<T extends object> = NonNullable<ParserOptions<T, T>["fields"]>;

export function listJsonFiles(dir: string): string[] {
  return fs.readdirSync(dir).filter((f) => path.extname(f) === ".json");
}

export function readJson<T = unknown>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

export function writeJson(filePath: string, data: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

export function writeText(filePath: string, contents: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents, "utf8");
}

export function jsonToCsv<T extends object>(rows: T[], fields: CsvFields<T>): string {
  return new Parser<T, T>({ fields }).parse(rows);
}
