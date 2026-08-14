import { requireTenant } from "@/lib/tenant/require-tenant";
import { getStaff } from "@/lib/onboarding/persistence";
import { StaffForm } from "../components/StaffForm";

export default async function StaffOnboardingPage() {
  const context = await requireTenant();
  const staff = await getStaff(context.businessId);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold text-blue-600">STEP 4 OF 5</p>
        <h1 className="mt-2 text-3xl font-bold">Add your team</h1>
        <p className="mt-2 text-gray-500">Add technicians, workers, supervisors or other people who will be assigned to jobs.</p>

        {staff.length > 0 && (
          <div className="mt-6 rounded-2xl border bg-white shadow-sm">
            {staff.map((member) => (
              <div key={member.id} className="flex items-center justify-between border-b p-5 last:border-b-0">
                <div>
                  <p className="font-semibold">{member.firstName} {member.lastName ?? ""}</p>
                  <p className="mt-1 text-sm text-gray-500">{member.roleTitle ?? "Staff member"}</p>
                </div>
                <span className="text-sm text-gray-500">{member.email ?? ""}</span>
              </div>
            ))}
          </div>
        )}

        <StaffForm />
      </div>
    </main>
  );
}
