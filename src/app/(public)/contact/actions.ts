"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { parseContactSubmissionForm } from "@/lib/contact-submissions";
import { requireVerifiedUser } from "@/lib/auth/permissions";
import { db } from "@/lib/db";

export async function submitContactForm(formData: FormData) {
  const user = await requireVerifiedUser();
  const submission = parseContactSubmissionForm(formData);

  await db.contactSubmission.create({
    data: {
      userId: user.id,
      subject: submission.subject,
      message: submission.message,
    },
  });

  revalidatePath("/contact");
  revalidatePath("/admin/contact");
  redirect("/contact?submitted=contact");
}
