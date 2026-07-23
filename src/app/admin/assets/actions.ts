"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/permissions";
import { buildStoredAssetPath, parseRoadSignAssetMetadata, sanitizeAssetFilename, validateUploadFile } from "@/lib/admin/road-sign-assets";
import { db } from "@/lib/db";
import { getUploadPath } from "@/lib/uploads/paths";

export async function uploadRoadSignAsset(formData: FormData) {
  const currentUser = await requireAdmin();
  const metadata = parseRoadSignAssetMetadata(formData);
  const file = formData.get("file");

  if (!(file instanceof File)) throw new Error("Choose an image file to upload.");
  validateUploadFile(file);

  const safeFilename = `${Date.now()}-${sanitizeAssetFilename(file.name)}`;
  const storedPath = buildStoredAssetPath({ type: metadata.type, filename: safeFilename });
  const absolutePath = getUploadPath(storedPath);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, Buffer.from(await file.arrayBuffer()));

  await db.uploadAsset.create({
    data: {
      type: metadata.type,
      filename: safeFilename,
      path: storedPath,
      mimeType: file.type,
      sizeBytes: file.size,
      title: metadata.title,
      category: metadata.category || null,
      description: metadata.description || null,
      sourceCredit: metadata.sourceCredit || null,
      uploadedById: currentUser.id,
    },
  });

  revalidatePath("/admin/assets");
  redirect("/admin/assets?uploaded=asset");
}
