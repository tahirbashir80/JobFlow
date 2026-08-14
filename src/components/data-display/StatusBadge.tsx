import { Badge } from "../ui/Badge";

export function StatusBadge({ status }: { status:string }) {
  const value=status.replaceAll("_"," ");
  const s=status.toUpperCase();
  const tone=s.includes("COMPLETED")||s==="PAID"||s==="SUCCEEDED"||s==="CLEARED"?"success":s.includes("OVERDUE")||s.includes("BOUNCE")||s==="FAILED"||s==="CANCELLED"||s==="VOID"?"danger":s.includes("PENDING")||s.includes("SCHEDULED")||s.includes("PARTIALLY")?"warning":s.includes("ASSIGNED")||s.includes("IN_PROGRESS")||s==="SENT"?"primary":"neutral";
  return <Badge tone={tone as never}>{value}</Badge>;
}
