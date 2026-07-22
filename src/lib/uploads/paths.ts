import path from "node:path";
export const uploadRoot = process.env.UPLOAD_DIR ?? "./uploads";
export function getUploadPath(...segments: string[]) { return path.join(uploadRoot, ...segments); }
