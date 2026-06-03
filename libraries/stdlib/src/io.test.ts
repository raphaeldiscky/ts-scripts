import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { jsonToCsv, listJsonFiles, readJson, writeJson, writeText } from "./io.js";

describe("io", () => {
  let tmp: string;

  beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "io-test-"));
  });

  afterEach(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it("writeJson + readJson roundtrips", () => {
    const file = path.join(tmp, "out.json");
    writeJson(file, { a: 1, b: "hi" });
    expect(readJson<{ a: number; b: string }>(file)).toEqual({ a: 1, b: "hi" });
  });

  it("writeJson creates missing parent dirs", () => {
    const file = path.join(tmp, "nested", "deep", "x.json");
    writeJson(file, [1, 2, 3]);
    expect(readJson(file)).toEqual([1, 2, 3]);
  });

  it("listJsonFiles returns only .json entries", () => {
    fs.writeFileSync(path.join(tmp, "a.json"), "{}");
    fs.writeFileSync(path.join(tmp, "b.txt"), "");
    fs.writeFileSync(path.join(tmp, "c.json"), "{}");
    expect(listJsonFiles(tmp).toSorted()).toEqual(["a.json", "c.json"]);
  });

  it("writeText writes contents and creates parent dirs", () => {
    const file = path.join(tmp, "nested", "out.txt");
    writeText(file, "hello");
    expect(fs.readFileSync(file, "utf8")).toBe("hello");
  });

  it("jsonToCsv emits header labels and row values", () => {
    const csv = jsonToCsv(
      [
        { a: 1, b: "x" },
        { a: 2, b: "y" },
      ],
      [
        { value: "a", label: "A" },
        { value: "b", label: "B" },
      ],
    );
    const [header, ...rows] = csv.split("\n");
    expect(header).toBe('"A","B"');
    expect(rows).toEqual(['1,"x"', '2,"y"']);
  });
});
