import path from "node:path";
import { format } from "date-fns";
import { createDataPaths, jsonToCsv, listJsonFiles, readJson, writeText } from "@local/stdlib";

const SCRIPT = "export-json-to-csv";

const { sourceDir, resultDir } = createDataPaths({
  baseDir: path.resolve(process.cwd(), "data"),
});

const FIELDS = [
  { value: "company_name", label: "Company Name" },
  { value: "customer_name", label: "Customer Name" },
  { value: "ssn", label: "SSN" },
  { value: "phone", label: "Phone" },
  { value: "customer_note", label: "Customer Note" },
  { value: "order_number", label: "Order Number" },
  { value: "order_method", label: "Order Method" },
  { value: "time", label: "Time" },
  { value: "payment", label: "Payment" },
  { value: "order_status", label: "Payment Status" },
  { value: "total", label: "Total" },
] as const;

function main(): void {
  const inDir = sourceDir(SCRIPT);
  const outDir = resultDir(SCRIPT);

  for (const file of listJsonFiles(inDir)) {
    const orders = readJson<unknown[]>(path.join(inDir, file));
    const rows = orders.map(formatOrder);
    const csv = jsonToCsv(rows, [...FIELDS]);
    const outName = `${path.parse(file).name}.csv`;
    writeText(path.join(outDir, outName), csv);
  }
}

function formatOrder(item: any): Record<string, unknown> {
  return {
    company_name: item.billing?.name,
    customer_name: item.billing?.metadata?.who_ordering || item.customer.name,
    ssn: item.billing?.metadata?.ssn || item.customer?.ssn,
    phone: item.billing?.metadata?.phone || item.customer.phone?.phone_number,
    customer_note: item.customer_note,
    order_number: item.order_number,
    order_method: getOrderMethodLabel(item.order_method),
    time: format(new Date(item.createdAt.$date), "dd MMM yyyy, hh:mm a"),
    payment: item.date_paid ? "Paid" : "Unpaid",
    order_status: getOrderStatusLabel(item.order_status),
    total: item.total,
  };
}

function getOrderMethodLabel(orderMethod: string): string {
  switch (orderMethod) {
    case "pickup":
      return "Pickup";
    case "delivery":
      return "Delivery";
    case "dine-in":
      return "Dine-in";
    case "wolt":
      return "Wolt";
    case "shipping":
      return "Shipping";
    case "instant":
      return "Instant";
    case "pending":
      return "Pending";
    default:
      return "Unknown";
  }
}

function getOrderStatusLabel(orderStatus: string): string {
  switch (orderStatus) {
    case "order_received":
      return "Order Received";
    case "processing":
      return "Processing";
    case "waiting_payment":
      return "Waiting Payment";
    case "ready_to_pickup":
      return "Ready for Pickup";
    case "ready_to_ship":
      return "Ready for Delivery";
    case "on_delivery":
      return "On Delivery";
    case "delivered":
      return "Delivered";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    case "refunded":
      return "Refunded";
    case "failed":
      return "Failed";
    default:
      return "Unknown";
  }
}

main();
