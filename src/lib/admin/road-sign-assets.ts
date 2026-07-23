import path from "node:path";
import { z } from "zod";
import type { UploadAssetType } from "@prisma/client";

import { ALLOWED_IMAGE_EXTENSIONS, ALLOWED_IMAGE_MIME_TYPES, MAX_IMAGE_UPLOAD_BYTES, isAllowedImageMimeType } from "@/lib/uploads/validation";

export const assetTypeOptions = [
  { value: "ROAD_SIGN", label: "Road sign" },
  { value: "LOGO", label: "Logo" },
  { value: "FAVICON", label: "Favicon" },
  { value: "BLOG_IMAGE", label: "Blog image" },
  { value: "CONTENT_IMAGE", label: "Content image" },
  { value: "OTHER", label: "Other" },
] as const satisfies { value: UploadAssetType; label: string }[];

const assetMetadataSchema = z.object({
  title: z.string().trim().min(1, "Enter a title."),
  category: z.string().trim(),
  description: z.string().trim(),
  sourceCredit: z.string().trim(),
  type: z.enum(assetTypeOptions.map((option) => option.value) as [UploadAssetType, ...UploadAssetType[]], {
    error: "Choose a valid asset type.",
  }),
});

export type RoadSignAssetMetadata = z.infer<typeof assetMetadataSchema>;

export function getAssetTypeOptions() {
  return [...assetTypeOptions];
}

export function parseRoadSignAssetMetadata(formData: FormData): RoadSignAssetMetadata {
  const parsed = assetMetadataSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category") ?? "",
    description: formData.get("description") ?? "",
    sourceCredit: formData.get("sourceCredit") ?? "",
    type: formData.get("type") ?? "ROAD_SIGN",
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Check the asset form.");
  }

  return parsed.data;
}

export function sanitizeAssetFilename(filename: string) {
  const parsed = path.parse(filename.trim());
  const ext = parsed.ext.toLowerCase();
  const base = parsed.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${base || "asset"}${ext}`;
}

export function buildStoredAssetPath({ type, filename }: { type: UploadAssetType; filename: string }) {
  const folderByType: Record<UploadAssetType, string> = {
    ROAD_SIGN: "road-signs",
    LOGO: "branding",
    FAVICON: "branding",
    BLOG_IMAGE: "blog-images",
    CONTENT_IMAGE: "content-images",
    OTHER: "other",
  };

  return `${folderByType[type]}/${filename}`;
}

export function validateUploadFile(file: File) {
  if (!file || file.size === 0) throw new Error("Choose an image file to upload.");
  if (file.size > MAX_IMAGE_UPLOAD_BYTES) throw new Error("Image must be 5 MB or smaller.");
  if (!isAllowedImageMimeType(file.type)) throw new Error(`Use one of these image types: ${ALLOWED_IMAGE_MIME_TYPES.join(", ")}.`);

  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_IMAGE_EXTENSIONS.includes(ext as (typeof ALLOWED_IMAGE_EXTENSIONS)[number])) {
    throw new Error(`Use one of these file extensions: ${ALLOWED_IMAGE_EXTENSIONS.join(", ")}.`);
  }
}
