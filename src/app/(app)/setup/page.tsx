"use client";

import { useState } from "react";
import {
  Archive,
  BriefcaseBusiness,
  ChevronRight,
  Clock3,
  DatabaseBackup,
  FileText,
  Mail,
  Pencil,
  Plus,
  Save,
  Settings2,
  Trash2,
  Users,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

const tabs = [
  { id: "company", label: "Company", icon: BriefcaseBusiness },
  { id: "industry", label: "Industry & Jobs", icon: Wrench },
  { id: "hours", label: "Hours", icon: Clock3 },
  { id: "users", label: "Users", icon: Users },
  { id: "templates", label: "Templates", icon: Mail },
  { id: "numbering", label: "Numbering", icon: FileText },
  { id: "backup", label: "Backup", icon: DatabaseBackup },
] as const;

type TabId = (typeof tabs)[number]["id"];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const initialHours = days.map((day, index) => ({
  day,
  open: ![4, 5].includes(index),
  from: index >= 4 && index <= 5 ? "09:00" : "08:00",
  to: index >= 4 && index <= 5 ? "13:00" : "17:00",
}));

const templateRows = [
  ["Job Confirmed", "When a job is confirmed"],
  ["Job In Progress", "When a technician starts the job"],
  ["Job Completed", "When a job is marked as completed"],
  ["Invoice Sent", "When an invoice is sent to the client"],
  ["Payment Received", "When a payment is recorded"],
];

function SectionShell({ icon: Icon, title, description, action, children }: {
  icon: typeof Settings2;
  title: string;
  description: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex items-start justify-between gap-4 px-5 py-4 md:px-6">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]">
            <Icon size={16} strokeWidth={2} />
          </span>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
        {action}
      </CardHeader>
      {children}
    </Card>
  );
}

function Field({ label, required, children, hint }: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.07em] text-[var(--muted)]">
        {label} {required ? <span className="text-[var(--danger)]">*</span> : null}
      </span>
      {children}
      {hint ? <span className="mt-1.5 block text-[11px] text-[var(--muted)]">{hint}</span> : null}
    </label>
  );
}

function Control({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`h-10 w-full rounded-[var(--jf-radius-control)] border border-[var(--border)] bg-[var(--form-background)] px-3 text-sm outline-none ${className}`} />;
}

function SelectControl({ children, className = "", ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`h-10 w-full rounded-[var(--jf-radius-control)] border border-[var(--border)] bg-[var(--form-background)] px-3 text-sm outline-none ${className}`}>{children}</select>;
}

function CompanyTab() {
  const [saved, setSaved] = useState(false);
  return (
    <SectionShell icon={BriefcaseBusiness} title="Company Profile" description="Your business branding and contact details">
      <CardContent className="p-5 md:p-6">
        <div className="grid gap-x-8 gap-y-5 md:grid-cols-2">
          <Field label="Company Name" required><Control defaultValue="Blue Smart LLC" /></Field>
          <Field label="Trade License / Registration No."><Control placeholder="e.g. 1234567" /></Field>
          <Field label="VAT Registration Number"><Control placeholder="e.g. 100123456789003" /></Field>
          <Field label="Default Currency"><SelectControl defaultValue="AED"><option value="AED">AED - UAE Dirham</option><option value="USD">USD - US Dollar</option><option value="PKR">PKR - Pakistani Rupee</option><option value="GBP">GBP - Pound Sterling</option></SelectControl></Field>
          <Field label="Phone Number"><Control defaultValue="+971 4 123 4567" /></Field>
          <Field label="Email Address"><Control type="email" defaultValue="info@bluesmart.ae" /></Field>
          <Field label="Address"><Control defaultValue="Dubai, UAE" /></Field>
          <Field label="Company Logo" hint="Upload a logo for invoices and branding. Recommended: PNG, max 2MB."><Control type="file" className="py-2 text-xs file:mr-3 file:rounded-md file:border-0 file:bg-[var(--surface-hover)] file:px-3 file:py-1 file:text-xs file:font-semibold" /></Field>
        </div>
        <div className="mt-6 flex items-center gap-3 border-t border-[var(--border)] pt-5">
          <Button icon={<Save size={15} />} onClick={() => { setSaved(true); window.setTimeout(() => setSaved(false), 1800); }}>Save Company Profile</Button>
          {saved ? <span className="text-xs font-semibold text-[var(--success)]">Saved</span> : null}
        </div>
      </CardContent>
    </SectionShell>
  );
}

function IndustryTab() {
  const [selected, setSelected] = useState("");
  return (
    <SectionShell icon={Wrench} title="Industry & Jobs" description="Manage business categories and their associated job types" action={<span className="rounded-full bg-[var(--surface-hover)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">7 industries</span>}>
      <CardContent className="p-5 md:p-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(260px,360px)_1fr]">
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] p-5">
            <Field label="Select Industry">
              <div className="flex gap-2">
                <SelectControl value={selected} onChange={(e) => setSelected(e.target.value)}>
                  <option value="">— Choose an industry —</option>
                  <option>Cleaning</option><option>Pest Control</option><option>HVAC</option><option>Electrical</option><option>Plumbing</option><option>Landscaping</option><option>General Maintenance</option>
                </SelectControl>
                <Button size="sm" icon={<Plus size={14} />} className="shrink-0">New</Button>
              </div>
            </Field>
            <div className="mt-4 border-t border-[var(--border)] pt-4 text-xs text-[var(--muted)]">7 industries available</div>
          </div>
          <div className="min-h-[280px] rounded-[var(--radius-lg)] border border-[var(--border)]">
            <div className="flex items-center justify-between border-b border-[var(--border)] p-5">
              <div className="flex items-center gap-2"><BriefcaseBusiness size={17} /><span className="font-semibold">Jobs</span><span className="rounded-full bg-[var(--surface-hover)] px-2 py-0.5 text-xs font-semibold">0</span></div>
              <Button size="sm" icon={<Plus size={14} />} variant="outline" disabled={!selected}>New Job</Button>
            </div>
            <div className="grid min-h-[220px] place-items-center p-6 text-sm text-[var(--muted)]">{selected ? `No jobs configured for ${selected}.` : "Select an industry to see its jobs."}</div>
          </div>
        </div>
      </CardContent>
    </SectionShell>
  );
}

function HoursTab() {
  const [hours, setHours] = useState(initialHours);
  const [saved, setSaved] = useState(false);
  return (
    <SectionShell icon={Clock3} title="Business Hours" description="Working days and times">
      <CardContent className="p-5 md:p-6">
        <div className="space-y-2">
          {hours.map((row, index) => (
            <div key={row.day} className="grid items-center gap-3 rounded-lg px-1 py-1.5 md:grid-cols-[150px_1fr_260px_18px_260px]">
              <span className="text-sm font-semibold">{row.day}</span>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={row.open} onChange={(e) => setHours((v) => v.map((x, i) => i === index ? { ...x, open: e.target.checked } : x))} className="h-4 w-4 accent-[var(--primary)]" />
                Open
              </label>
              <Control type="time" value={row.from} disabled={!row.open} onChange={(e) => setHours((v) => v.map((x, i) => i === index ? { ...x, from: e.target.value } : x))} />
              <span className="hidden text-center text-xs text-[var(--muted)] md:block">to</span>
              <Control type="time" value={row.to} disabled={!row.open} onChange={(e) => setHours((v) => v.map((x, i) => i === index ? { ...x, to: e.target.value } : x))} />
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-3 border-t border-[var(--border)] pt-5">
          <Button icon={<Save size={15} />} onClick={() => { setSaved(true); window.setTimeout(() => setSaved(false), 1800); }}>Save Business Hours</Button>
          {saved ? <span className="text-xs font-semibold text-[var(--success)]">Saved</span> : null}
        </div>
      </CardContent>
    </SectionShell>
  );
}

function UsersTab() {
  const users = [
    ["tahir", "Tahir B.", "Admin", "tahir@bluesmart.ae"],
    ["ahsan", "Ahsan", "Technician", "ahsan@bluesmart.ae"],
  ];
  return (
    <SectionShell icon={Users} title="User Management" description="Manage system users and their roles" action={<Button size="sm" icon={<Plus size={14} />}>Add User</Button>}>
      <CardContent className="p-5 md:p-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead><tr className="border-b border-[var(--border)]"><th className="px-0 py-3 text-left">Username</th><th className="px-0 py-3 text-left">Full Name</th><th className="px-0 py-3 text-left">Role</th><th className="px-0 py-3 text-left">Email</th><th className="px-0 py-3 text-right">Actions</th></tr></thead>
            <tbody>{users.map(([username, name, role, email]) => <tr key={username} className="border-b border-[var(--border)] last:border-0"><td className="py-3 font-semibold">{username}</td><td className="py-3">{name}</td><td className="py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${role === "Admin" ? "bg-[var(--warning-soft)] text-[var(--warning)]" : "bg-[var(--success-soft)] text-[var(--success)]"}`}>{role}</span></td><td className="py-3">{email}</td><td className="py-3 text-right"><div className="flex justify-end gap-1"><button className="rounded-md p-2 text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]" aria-label={`Edit ${username}`}><Pencil size={14}/></button><button className="rounded-md p-2 text-[var(--muted)] hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]" aria-label={`Delete ${username}`}><Trash2 size={14}/></button></div></td></tr>)}</tbody>
          </table>
        </div>
      </CardContent>
    </SectionShell>
  );
}

function TemplatesTab() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <SectionShell icon={Mail} title="Notification Templates" description="Customize WhatsApp, Email, and SMS messages">
      <CardContent className="space-y-2.5 p-5 md:p-6">
        {templateRows.map(([title, description], index) => (
          <div key={title} className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
            <button onClick={() => setOpen(open === index ? null : index)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-[var(--surface-hover)]">
              <ChevronRight size={14} className={`shrink-0 transition-transform ${open === index ? "rotate-90" : ""}`} />
              <span className="text-sm font-semibold">{title}</span>
              <span className="text-sm text-[var(--muted)]">— {description}</span>
            </button>
            {open === index ? <div className="border-t border-[var(--border)] bg-[var(--surface-subtle)] p-4"><textarea rows={4} className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-sm" defaultValue={`Hello {{customer}}, your ${title.toLowerCase()} notification from {{business}}.`} /><div className="mt-3 flex justify-end"><Button size="sm" icon={<Save size={14} />}>Save Template</Button></div></div> : null}
          </div>
        ))}
      </CardContent>
    </SectionShell>
  );
}

function NumberingTab() {
  return (
    <SectionShell icon={FileText} title="Job & Invoice Numbering" description="Configure auto-generation formats">
      <CardContent className="p-5 md:p-6">
        <div className="grid gap-7 md:grid-cols-2">
          {[{ title: "Job Number Format", format: "JOB-0000", next: "1", preview: "JOB-0001" }, { title: "Invoice Number Format", format: "INV-0000", next: "1", preview: "INV-0001" }].map((item) => <div key={item.title} className="space-y-4">
            <Field label={item.title}><SelectControl defaultValue={item.format}>{item.title.startsWith("Job") ? <><option>JOB-0000</option><option>JOB-YY-0000</option><option>JOB-YYYY-0000</option></> : <><option>INV-0000</option><option>INV-YY-0000</option><option>INV-YYYY-0000</option></>}</SelectControl></Field>
            <p className="text-xs text-[var(--muted)]">Preview: <span className="font-semibold text-[var(--foreground)]">{item.preview}</span></p>
            <Field label={item.title.replace("Format", "Next Number")}><Control defaultValue={item.next} inputMode="numeric" /></Field>
            <p className="text-xs text-[var(--muted)]">The next {item.title.startsWith("Job") ? "job" : "invoice"} will use this number.</p>
          </div>)}
        </div>
        <div className="mt-6 border-t border-[var(--border)] pt-5"><Button icon={<Save size={15} />}>Save Numbering Settings</Button></div>
      </CardContent>
    </SectionShell>
  );
}

function BackupTab() {
  return (
    <SectionShell icon={DatabaseBackup} title="Backup & Data Management" description="Export, import, and manage your data">
      <CardContent className="p-5 md:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[var(--radius-lg)] bg-[var(--surface-subtle)] p-5">
            <div className="flex items-center gap-2 text-sm font-semibold"><Archive size={16} /> Export All Data</div>
            <p className="mt-2 text-sm text-[var(--muted)]">Download a JSON backup of all your business data.</p>
            <Button className="mt-4" icon={<DatabaseBackup size={15} />}>Export JSON</Button>
          </div>
          <div className="rounded-[var(--radius-lg)] bg-[var(--surface-subtle)] p-5">
            <div className="flex items-center gap-2 text-sm font-semibold"><DatabaseBackup size={16} /> Import Data</div>
            <p className="mt-2 text-sm text-[var(--muted)]">Restore data from a JSON backup file.</p>
            <div className="mt-4 flex flex-wrap items-center gap-3"><Control type="file" accept="application/json,.json" className="h-10 py-2 text-xs" /><Button variant="danger" icon={<DatabaseBackup size={15} />}>Restore from Backup</Button></div>
          </div>
        </div>
        <div className="mt-5 border-t border-[var(--border)] pt-5">
          <div className="flex items-center gap-2 text-sm font-semibold"><Trash2 size={16} className="text-[var(--danger)]" /> Reset All Data</div>
          <p className="mt-2 text-sm text-[var(--danger)]">Warning: This will permanently delete all data. This cannot be undone.</p>
          <Button variant="danger" className="mt-4" icon={<Trash2 size={15} />}>Reset Everything</Button>
        </div>
      </CardContent>
    </SectionShell>
  );
}

export default function SetupPage() {
  const [activeTab, setActiveTab] = useState<TabId>("company");
  const ActiveIcon = tabs.find((tab) => tab.id === activeTab)?.icon ?? Settings2;

  return (
    <main className="min-h-full" data-page-width>
      <div className="py-5 md:py-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid h-9 w-9 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]"><Settings2 size={20} /></span>
          <div>
            <h1 className="jf-page-title">System Setup</h1>
            <p className="jf-page-subtitle mt-1">Configure your business settings, users, templates, and more</p>
          </div>
        </div>

        <nav className="mt-6 flex gap-1 overflow-x-auto border-b border-[var(--border)]" aria-label="Setup sections">
          {tabs.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return <button key={id} onClick={() => setActiveTab(id)} className={`group flex shrink-0 items-center gap-2 rounded-t-[10px] border-b-2 px-4 py-3 text-sm font-semibold ${active ? "border-[var(--primary)] bg-[var(--surface)] text-[var(--primary)]" : "border-transparent text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"}`} aria-current={active ? "page" : undefined}>
              <Icon size={16} strokeWidth={2} />{label}{active ? <span className="absolute" /> : null}
            </button>;
          })}
        </nav>

        <div className="mt-5">
          {activeTab === "company" && <CompanyTab />}
          {activeTab === "industry" && <IndustryTab />}
          {activeTab === "hours" && <HoursTab />}
          {activeTab === "users" && <UsersTab />}
          {activeTab === "templates" && <TemplatesTab />}
          {activeTab === "numbering" && <NumberingTab />}
          {activeTab === "backup" && <BackupTab />}
        </div>

        <div className="sr-only" aria-live="polite">Current setup section: {ActiveIcon.name}</div>
      </div>
    </main>
  );
}
