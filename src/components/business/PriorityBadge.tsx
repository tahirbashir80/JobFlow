import { Badge } from "../ui/Badge";
export function PriorityBadge({ priority }: { priority:string }) {
  const p=priority.toUpperCase();
  const tone=p==="URGENT"||p==="HIGH"?"danger":p==="MEDIUM"?"warning":"neutral";
  return <Badge tone={tone as never}>{priority.replaceAll("_"," ")}</Badge>;
}
