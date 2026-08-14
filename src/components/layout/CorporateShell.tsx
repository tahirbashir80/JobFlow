"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Bell, BriefcaseBusiness, CalendarDays, ChevronDown, ChevronsLeft, ChevronsRight,
  Command, HardHat, LayoutDashboard, LogOut, Menu, Palette, Repeat2, Search,
  Settings, Truck, Users, X, FileText, FileSignature
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAppearance } from "../theme/ThemeProvider";
import { cn } from "../ui/cn";

type NavItem = [label: string, href: string, Icon: LucideIcon];
type NavGroup = { label: string; items: NavItem[] };

const groups: NavGroup[] = [
  {
    label: "Operations",
    items: [
      ["Dashboard", "/dashboard", LayoutDashboard],
      ["Customers", "/customers", Users],
      ["Jobs", "/jobs", BriefcaseBusiness],
      ["Calendar", "/calendar", CalendarDays],
      ["Dispatch", "/dispatch", Truck],
      ["Technicians", "/technicians", HardHat],
      ["Recurring Jobs", "/recurring", Repeat2],
      ["Contracts", "/contracts", FileSignature],
    ],
  },
  {
    label: "Finance",
    items: [
      ["Invoices", "/invoices", FileText],
    ],
  },
  {
    label: "System",
    items: [
      ["Notifications", "/notifications", Bell],
      ["Setup", "/setup", Settings],
    ],
  },
];

const allItems: NavItem[] = groups.flatMap(group => group.items);

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`));
}

function NavItems({
  collapsed,
  pathname,
  onNavigate,
}: {
  collapsed: boolean;
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="space-y-5">
      {groups.map(group => (
        <section key={group.label}>
          {!collapsed && <p className="jf-shell-nav-group">{group.label}</p>}
          <div className="space-y-0.5">
            {group.items.map(([label, href, Icon]) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onNavigate}
                  title={collapsed ? label : undefined}
                  data-active={active}
                  className={cn("jf-shell-nav-item", collapsed && "justify-center px-0")}
                >
                  <Icon size={16} strokeWidth={active ? 2.1 : 1.75} />
                  {!collapsed && <span className="truncate">{label}</span>}
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function GlobalSearch({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(
    () =>
      allItems
        .filter(([label]) => label.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 6),
    [query]
  );

  return (
    <div className={cn("relative w-full", mobile ? "w-full" : "w-full")}>
      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
        <input
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search JobFlow..."
          aria-label="Global search"
          className="jf-shell-search h-[38px] w-full rounded-[9px] border border-[var(--border)] bg-[var(--surface-subtle)] pl-9 pr-12 text-[12px] outline-none focus:border-[var(--primary)] focus:bg-[var(--surface)] focus:ring-2 focus:ring-[var(--primary)]/10"
        />
        <span className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--muted)] sm:flex">
          <Command size={10} /> K
        </span>
      </div>
      <AnimatePresence>
        {open && query && (
          <>
            <button className="fixed inset-0 z-40 cursor-default" aria-label="Close search" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.99 }}
              className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-xl"
            >
              {results.length ? (
                results.map(([label, href, Icon]) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-[var(--surface-hover)]",
                      isActive(pathname, href) && "text-[var(--primary)]"
                    )}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </Link>
                ))
              ) : (
                <p className="px-3 py-4 text-sm text-[var(--muted)]">No matching navigation item.</p>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function HeaderActions() {
  const [notificationOpen, setNotificationOpen] = useState(false);
  return (
    <div className="flex items-center gap-1">
      <div className="relative">
        <button
          onClick={() => setNotificationOpen(v => !v)}
          aria-label="Notifications"
          className="relative grid h-9 w-9 place-items-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
        >
          <Bell size={18} />
          <span className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-[var(--danger)] ring-2 ring-[var(--surface)]" />
        </button>
        <AnimatePresence>
          {notificationOpen && (
            <>
              <button className="fixed inset-0 z-40" aria-label="Close notifications" onClick={() => setNotificationOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xl"
              >
                <div className="border-b border-[var(--border)] px-4 py-3">
                  <p className="font-semibold">Notifications</p>
                  <p className="mt-0.5 text-xs text-[var(--muted)]">Your latest JobFlow activity</p>
                </div>
                <div className="p-4">
                  <p className="text-sm text-[var(--muted)]">Notification center is ready for your live notification data.</p>
                </div>
                <Link href="/notifications" onClick={() => setNotificationOpen(false)} className="block border-t border-[var(--border)] px-4 py-3 text-sm font-semibold text-[var(--primary)] hover:bg-[var(--surface-hover)]">
                  View all notifications
                </Link>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <div className="hidden h-7 w-px bg-[var(--border)] sm:block" />

      <details className="relative">
        <summary className="jf-shell-user flex cursor-pointer list-none items-center gap-2 px-2 py-1.5 hover:bg-[var(--surface-hover)] [&::-webkit-details-marker]:hidden">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--primary-soft)] text-xs font-bold text-[var(--primary)]">U</span>
          <span className="hidden text-left sm:block">
            <span className="block text-xs font-semibold">User</span>
            <span className="block text-[10px] text-[var(--muted)]">Workspace</span>
          </span>
          <ChevronDown size={14} className="text-[var(--muted)]" />
        </summary>
        <div className="absolute right-0 top-12 z-50 w-52 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-xl">
          <Link href="/settings/appearance" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-[var(--surface-hover)]">
            <Palette size={16} /> Appearance
          </Link>
          <Link href="/setup" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-[var(--surface-hover)]">
            <Settings size={16} /> Setup
          </Link>
          <div className="my-1 h-px bg-[var(--border)]" />
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--danger)] hover:bg-[var(--surface-hover)]">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </details>
    </div>
  );
}

export function CorporateShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { settings } = useAppearance();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("jobflow.sidebar.collapsed");
    if (settings.sidebarMode === "collapsed") setCollapsed(true);
    else if (settings.sidebarMode === "expanded") setCollapsed(false);
    else if (saved) setCollapsed(saved === "true");
  }, [settings.sidebarMode]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("jobflow.sidebar.collapsed", String(next));
  };

  if (settings.navigation === "top") {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur">
          <div className="flex min-h-16 items-center gap-3 px-4 sm:px-6">
            <Link href="/dashboard" className="shrink-0 text-[18px] font-extrabold tracking-[-0.02em]">JobFlow</Link>
            <div className="hidden min-w-0 flex-1 md:block"><GlobalSearch /></div>
            <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto lg:flex">
              {groups[0].items.slice(0, 7).map(([label, href, Icon]) => (
                <Link key={href} href={href} className={cn("whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium transition", isActive(pathname, href) ? "bg-[var(--primary-soft)] text-[var(--primary)]" : "text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]")}>
                  <Icon size={15} className="mr-1.5 inline-block align-[-2px]" />{label}
                </Link>
              ))}
            </nav>
            <HeaderActions />
          </div>
          <div className="border-t border-[var(--border)] px-4 py-2 md:hidden"><GlobalSearch mobile /></div>
        </header>
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-[var(--border)] bg-[var(--surface)]/95 px-4 backdrop-blur lg:hidden">
        <button onClick={() => setMobileOpen(true)} aria-label="Open navigation" className="grid h-10 w-10 place-items-center rounded-xl text-[var(--muted)] hover:bg-[var(--surface-hover)]"><Menu size={20} /></button>
        <Link href="/dashboard" className="font-bold tracking-tight">JobFlow</Link>
        <div className="ml-auto"><HeaderActions /></div>
      </header>

      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 68 : 224 }}
        transition={{ type: "spring", stiffness: 420, damping: 38 }}
        className="jf-shell-sidebar fixed inset-y-0 left-0 z-50 hidden overflow-hidden border-r border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] lg:block"
      >
        <div className="flex h-[72px] items-center gap-2.5 border-b border-[var(--sidebar-border)] px-3.5">
          {!collapsed && (
            <span className="jf-shell-brand-mark">JF</span>
          )}
          <Link href="/dashboard" className="min-w-0 text-white">
            {collapsed ? (
              <span className="jf-shell-brand-mark">JF</span>
            ) : (
              <>
                <span className="jf-shell-brand block">JobFlow</span>
                <span className="jf-shell-brand-meta">Job Management CRM</span>
              </>
            )}
          </Link>
          <button onClick={toggle} aria-label={collapsed ? "Expand navigation" : "Collapse navigation"} className="ml-auto grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-white">
            {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
          </button>
        </div>
        <div className="h-[calc(100vh-72px)] overflow-y-auto px-2.5 py-4">
          <NavItems collapsed={collapsed} pathname={pathname} />
          <div className="mt-6 border-t border-[var(--sidebar-border)] pt-4">
            <Link href="/settings/appearance" title={collapsed ? "Appearance" : undefined} className={cn("jf-shell-nav-item", collapsed && "justify-center px-0")}>
              <Palette size={18} />
              {!collapsed && <span>Appearance</span>}
            </Link>
          </div>
        </div>
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              aria-label="Close navigation"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 420, damping: 38 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] overflow-y-auto border-r border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] p-3 shadow-2xl lg:hidden"
            >
              <div className="flex h-12 items-center justify-between px-2">
                <Link href="/dashboard" className="font-bold text-white">JobFlow</Link>
                <button onClick={() => setMobileOpen(false)} aria-label="Close navigation" className="grid h-9 w-9 place-items-center rounded-lg text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-white"><X size={18} /></button>
              </div>
              <div className="mt-3"><NavItems collapsed={false} pathname={pathname} onNavigate={() => setMobileOpen(false)} /></div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="hidden lg:block" style={{ height: "var(--jf-topbar-height)" }} />
      <div
        className="jf-shell-topbar fixed left-0 right-0 top-0 z-20 hidden border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur lg:block"
        style={{ marginLeft: collapsed ? 68 : 224 }}
      >
        <div className="flex h-full items-center justify-between gap-4 px-5">
          <div className="jf-shell-search"><GlobalSearch /></div>
          <HeaderActions />
        </div>
      </div>

      <main
        className="min-h-screen transition-[margin] duration-200 lg:[margin-left:var(--jf-sidebar-width)]"
        style={{ "--jf-sidebar-width": `${collapsed ? 68 : 224}px` } as React.CSSProperties}
      >
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: settings.motion === "full" ? 4 : 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: settings.motion === "off" ? 0 : settings.motion === "reduced" ? 0.12 : 0.18 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
