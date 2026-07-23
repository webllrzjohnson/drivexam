import { ModulePage } from "@/components/admin/module-page";
import { UserRoleForm } from "@/components/admin/user-role-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCurrentUser } from "@/lib/auth/permissions";
import { getUserSearchFilter } from "@/lib/admin/users";
import { db } from "@/lib/db";

type AdminUsersPageProps = {
  searchParams: Promise<{ q?: string; updated?: string; error?: string }>;
};

function formatDate(value: Date | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-CA", { dateStyle: "medium" }).format(value);
}

export default async function Page({ searchParams }: AdminUsersPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const currentUser = await getCurrentUser();
  const users = await db.user.findMany({
    where: getUserSearchFilter(query),
    orderBy: [{ role: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true,
      currentStage: true,
      deletedAt: true,
      createdAt: true,
    },
    take: 50,
  });
  const returnTo = `/admin/users${query ? `?q=${encodeURIComponent(query)}` : ""}`;

  return (
    <ModulePage slug="users">
      <div className="space-y-5">
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-950">
          <p className="font-semibold">Users and roles are live.</p>
          <p>Search accounts, review verification/deletion state, and promote trusted users to Author or Admin.</p>
        </div>

        {params.updated === "role" ? (
          <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900">Role updated.</p>
        ) : null}
        {params.error === "self-role" ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">For safety, you cannot change your own role.</p>
        ) : null}

        <form className="flex flex-col gap-2 sm:flex-row" action="/admin/users">
          <label className="sr-only" htmlFor="user-search">Search users</label>
          <Input id="user-search" name="q" placeholder="Search by name or email" defaultValue={query} />
          <Button type="submit">Search</Button>
          {query ? <Button asChild type="button" variant="outline"><a href="/admin/users">Clear</a></Button> : null}
        </form>

        <div className="overflow-hidden rounded-xl border bg-white">
          <div className="grid grid-cols-1 gap-3 border-b bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 md:grid-cols-[1.4fr_0.8fr_0.8fr_1.2fr]">
            <span>User</span>
            <span>Status</span>
            <span>Stage</span>
            <span>Role</span>
          </div>
          {users.length ? (
            users.map((user) => (
              <div className="grid grid-cols-1 gap-3 border-b px-4 py-4 last:border-b-0 md:grid-cols-[1.4fr_0.8fr_0.8fr_1.2fr]" key={user.id}>
                <div>
                  <p className="font-medium text-slate-950">{user.name ?? "Unnamed user"}</p>
                  <p className="text-sm text-slate-600">{user.email ?? "No email"}</p>
                  <p className="text-xs text-slate-500">Joined {formatDate(user.createdAt)}</p>
                </div>
                <div className="text-sm text-slate-700">
                  <p>{user.deletedAt ? "Deleted" : user.emailVerified ? "Verified" : "Unverified"}</p>
                  {user.emailVerified ? <p className="text-xs text-slate-500">{formatDate(user.emailVerified)}</p> : null}
                </div>
                <div className="text-sm text-slate-700">{user.currentStage ?? "Not set"}</div>
                <UserRoleForm disabled={currentUser?.id === user.id || Boolean(user.deletedAt)} returnTo={returnTo} role={user.role} userId={user.id} />
              </div>
            ))
          ) : (
            <p className="px-4 py-8 text-center text-sm text-slate-600">No users found.</p>
          )}
        </div>
      </div>
    </ModulePage>
  );
}
