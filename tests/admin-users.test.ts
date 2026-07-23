import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { canChangeUserRole, getUserSearchFilter, parseUserRoleForm } from "../src/lib/admin/users";

describe("admin user management helpers", () => {
  it("builds a safe case-insensitive search filter for name or email", () => {
    assert.deepEqual(getUserSearchFilter("  Louie@Example.COM  "), {
      OR: [
        { email: { contains: "Louie@Example.COM", mode: "insensitive" } },
        { name: { contains: "Louie@Example.COM", mode: "insensitive" } },
      ],
    });
  });

  it("omits the search filter for blank searches", () => {
    assert.equal(getUserSearchFilter("   "), undefined);
  });

  it("parses supported role changes from form data", () => {
    const formData = new FormData();
    formData.set("userId", "user_123");
    formData.set("role", "AUTHOR");

    assert.deepEqual(parseUserRoleForm(formData), { userId: "user_123", role: "AUTHOR" });
  });

  it("rejects invalid role changes", () => {
    const formData = new FormData();
    formData.set("userId", "user_123");
    formData.set("role", "OWNER");

    assert.throws(() => parseUserRoleForm(formData), /Choose a valid role/);
  });

  it("prevents admins from changing their own role", () => {
    assert.equal(canChangeUserRole({ currentUserId: "admin_1", targetUserId: "admin_1" }), false);
    assert.equal(canChangeUserRole({ currentUserId: "admin_1", targetUserId: "user_1" }), true);
  });
});
