import { Badge } from "../ui/Badge";
export function PaymentMethodBadge({ method }: { method:string }) {
  return <Badge tone="neutral">{method.replaceAll("_"," ")}</Badge>;
}
