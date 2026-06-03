import path from "node:path";
import { createDataPaths, jsonToCsv, writeText } from "@local/stdlib";

const SCRIPT = "json-to-csv";

const { resultDir } = createDataPaths({
  baseDir: path.resolve(process.cwd(), "data"),
});

interface DataEntry {
  date: string;
  branch: string;
  item: string;
  debit: number | null;
  credit: number | null;
}

const DATA: DataEntry[] = [
  { date: "08/11/2024", branch: "Branch 1", item: "Aur", debit: 2000, credit: null },
  { date: "08/11/2024", branch: "Branch 1", item: "Netgiro", debit: 1000, credit: null },
  { date: "08/11/2024", branch: "Branch 1", item: "Paypal", debit: 2400, credit: null },
  { date: "08/11/2024", branch: "Branch 1", item: "Sales: Tax 11%", debit: null, credit: 4000 },
  { date: "08/11/2024", branch: "Branch 1", item: "Sales: Tax 24%", debit: null, credit: 1400 },
];

const FIELDS = [
  { value: "date", label: "Date" },
  { value: "branch", label: "Branch" },
  { value: "item", label: "Item" },
  { value: "debit", label: "Debit" },
  { value: "credit", label: "Credit" },
] as const;

function main(): void {
  const csv = jsonToCsv(DATA, [...FIELDS]);
  const outFile = path.join(resultDir(SCRIPT), "export.csv");
  writeText(outFile, csv);
  console.log(`Wrote ${outFile}`);
}

main();
