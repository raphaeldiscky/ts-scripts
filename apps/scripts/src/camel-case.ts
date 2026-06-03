import path from "node:path";
import { createDataPaths, listJsonFiles, readJson, writeJson } from "@local/stdlib";

const SCRIPT = "camel-case";

const { sourceDir, resultDir } = createDataPaths({
  baseDir: path.resolve(process.cwd(), "data"),
});

function main(): void {
  const inDir = sourceDir(SCRIPT);
  const outDir = resultDir(SCRIPT);

  for (const file of listJsonFiles(inDir)) {
    const obj = readJson<object>(path.join(inDir, file));
    writeJson(path.join(outDir, file), camelCaseifyMongoObjectKeys(obj));
  }
}

function camelCaseifyMongoObjectKeys(obj: object): object {
  if (Array.isArray(obj)) {
    return obj.map(camelCaseifyMongoObjectKeys);
  } else if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        let newValue;
        let newKey = key;

        if (key === "_id" || key === "$oid") {
          newKey = "mongoId";
        } else if (key === "__v") {
          newKey = key;
        } else if (key === "data") {
          newKey = "metadata";
        } else {
          newKey = snakeCaseToCamelCase(key);
        }

        if (value === null || value === undefined) {
          return [newKey, value];
        } else if (
          Array.isArray(value) &&
          value.every((item) => typeof item === "object" && "$oid" in item)
        ) {
          newValue = value.map((item) => item.$oid);
        } else if (Array.isArray(value)) {
          newValue = value.map(camelCaseifyMongoObjectKeys);
        } else if (typeof value === "object" && "$oid" in value) {
          newValue = value.$oid;
        } else if (typeof value === "object" && value !== null && "$date" in value) {
          newValue = value.$date;
        } else if (key === "_id" && typeof value !== "string") {
          newValue = value.$oid;
        } else {
          newValue = camelCaseifyMongoObjectKeys(value);
        }
        return [newKey, newValue];
      }),
    );
  } else {
    return obj;
  }
}

function snakeCaseToCamelCase(str: string): string {
  return str.replace(/([-_][a-z0-9])/gi, (group) =>
    group.toUpperCase().replace("-", "").replace("_", ""),
  );
}

main();
