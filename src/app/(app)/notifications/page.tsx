import { requireTenant } from "@/lib/tenant/require-tenant";
import { listNotifications } from "@/lib/notifications/persistence";
import { NotificationCenter } from "./NotificationCenter";

export default async function NotificationsPage() {
  const context=await requireTenant();
  const notifications=await listNotifications(context.businessId,context.userId);
  return <main className="p-8"><div className="mx-auto max-w-4xl">
    <p className="text-sm font-semibold text-blue-600">ACTIVITY</p>
    <h1 className="mt-1 text-3xl font-bold">Notifications</h1>
    <p className="mt-2 text-gray-500">Stay on top of assignments and important JobFlow activity.</p>
    <div className="mt-7"><NotificationCenter notifications={notifications}/></div>
  </div></main>;
}
