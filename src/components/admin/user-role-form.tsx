import type { Role } from "@prisma/client";

import { updateUserRole } from "@/app/admin/users/actions";
import { manageableRoles } from "@/lib/admin/users";
import { Button } from "@/components/ui/button";

const roleLabels: Record<Role, string> = {
  USER: "User",
  AUTHOR: "Author",
  ADMIN: "Admin",
};

type UserRoleFormProps = {
  userId: string;
  role: Role;
  disabled?: boolean;
  returnTo: string;
};

export function UserRoleForm({ userId, role, disabled = false, returnTo }: UserRoleFormProps) {
  return (
    <form action={updateUserRole} className="flex flex-wrap items-center gap-2">
      <input name="userId" type="hidden" value={userId} />
      <input name="returnTo" type="hidden" value={returnTo} />
      <label className="sr-only" htmlFor={`role-${userId}`}>Role</label>
      <select
        className="h-9 rounded-lg border border-border bg-white px-2 text-sm disabled:opacity-60"
        defaultValue={role}
        disabled={disabled}
        id={`role-${userId}`}
        name="role"
      >
        {manageableRoles.map((option) => (
          <option key={option} value={option}>{roleLabels[option]}</option>
        ))}
      </select>
      <Button disabled={disabled} size="sm" type="submit" variant="outline">
        Save role
      </Button>
      {disabled ? <span className="text-xs text-slate-500">You cannot change your own role.</span> : null}
    </form>
  );
}
