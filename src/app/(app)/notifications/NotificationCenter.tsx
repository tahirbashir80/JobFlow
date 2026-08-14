"use client";

import { useTransition } from "react";
import { markAllNotificationsReadAction, markNotificationReadAction } from "../jobs/actions";

function timeAgo(value:string) {
  const diff=Math.max(0,Date.now()-new Date(value).getTime());
  const mins=Math.floor(diff/60000);
  if(mins<1) return "Just now";
  if(mins<60) return `${mins}m ago`;
  const hours=Math.floor(mins/60);
  if(hours<24) return `${hours}h ago`;
  const days=Math.floor(hours/24);
  if(days<7) return `${days}d ago`;
  return new Date(value).toLocaleDateString();
}

export function NotificationCenter({ notifications }: { notifications: any[] }) {
  const [pending,startTransition]=useTransition();
  const unread=notifications.filter(n=>!n.read).length;

  return <section className="rounded-2xl border bg-white shadow-sm">
    <div className="flex flex-col gap-3 border-b p-6 sm:flex-row sm:items-center sm:justify-between">
      <div><h2 className="font-semibold">Notifications</h2><p className="mt-1 text-sm text-gray-500">{unread} unread · showing the latest {notifications.length}</p></div>
      {unread>0 && <button disabled={pending} onClick={()=>startTransition(()=>markAllNotificationsReadAction())} className="rounded-lg border px-3 py-2 text-sm font-semibold disabled:opacity-50">Mark all as read</button>}
    </div>
    <div className="divide-y">
      {notifications.map(n=><button key={n.id} disabled={pending||n.read} onClick={()=>startTransition(()=>markNotificationReadAction(n.id))} className={`block w-full text-left p-5 transition hover:bg-gray-50 ${n.read?"":"bg-blue-50/40"}`}>
        <div className="flex items-start gap-4">
          <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${n.read?"bg-gray-200":"bg-blue-600"}`}/>
          <div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-4"><p className="font-semibold">{n.subject}</p><span className="shrink-0 text-xs text-gray-400">{timeAgo(n.createdAt)}</span></div><p className="mt-1 text-sm text-gray-600">{n.message}</p></div>
        </div>
      </button>)}
      {!notifications.length && <div className="p-12 text-center"><p className="font-medium">You're all caught up.</p><p className="mt-1 text-sm text-gray-400">Important JobFlow activity will appear here.</p></div>}
    </div>
  </section>;
}
