import { z } from "zod";

import { db } from "@/lib/db";

export const siteSettingsKey = "site";

export const defaultSiteSettings = {
  siteName: "drivexam",
  tagline: "Ontario driving exam prep for G1, G2, and full G learners.",
  homepageHeroTitle: "Prepare for your Ontario driving exam with confidence.",
  homepageHeroSubtitle: "Study the handbook, practise G1 questions, and build safer driving habits for G2 and full G.",
  contactEmail: "shuai.jan28@gmail.com",
  seoTitle: "drivexam | Ontario G1, G2, and G Test Prep",
  seoDescription: "Practice for Ontario driving exams with guided study, quizzes, lessons, and road-test preparation.",
  facebookUrl: "",
  instagramUrl: "",
  supportUrl: "/contact",
};

export type SiteSettings = typeof defaultSiteSettings;

const siteSettingsSchema = z.object({
  siteName: z.string().trim().min(1, "Enter a site name."),
  tagline: z.string().trim().min(1, "Enter a short tagline."),
  homepageHeroTitle: z.string().trim().min(1, "Enter a homepage title."),
  homepageHeroSubtitle: z.string().trim().min(1, "Enter homepage supporting copy."),
  contactEmail: z.string().trim().toLowerCase().email("Enter a valid contact email."),
  seoTitle: z.string().trim().min(1, "Enter an SEO title."),
  seoDescription: z.string().trim().min(1, "Enter an SEO description."),
  facebookUrl: z.string().trim(),
  instagramUrl: z.string().trim(),
  supportUrl: z.string().trim().min(1, "Enter a support URL."),
});

export function siteSettingsToFormValues(value: unknown): SiteSettings {
  const parsed = z.object({
    siteName: z.string().optional(),
    tagline: z.string().optional(),
    homepageHeroTitle: z.string().optional(),
    homepageHeroSubtitle: z.string().optional(),
    contactEmail: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    facebookUrl: z.string().optional(),
    instagramUrl: z.string().optional(),
    supportUrl: z.string().optional(),
  }).safeParse(value);

  if (!parsed.success) return defaultSiteSettings;

  return {
    ...defaultSiteSettings,
    ...Object.fromEntries(Object.entries(parsed.data).filter(([, field]) => typeof field === "string")),
  };
}

export function parseSiteSettingsForm(formData: FormData): SiteSettings {
  const parsed = siteSettingsSchema.safeParse({
    siteName: formData.get("siteName"),
    tagline: formData.get("tagline"),
    homepageHeroTitle: formData.get("homepageHeroTitle"),
    homepageHeroSubtitle: formData.get("homepageHeroSubtitle"),
    contactEmail: formData.get("contactEmail"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
    facebookUrl: formData.get("facebookUrl") ?? "",
    instagramUrl: formData.get("instagramUrl") ?? "",
    supportUrl: formData.get("supportUrl"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Check the site settings form.");
  }

  return parsed.data;
}

export async function getSiteSettings() {
  const record = await db.siteSetting.findUnique({ where: { key: siteSettingsKey } });
  return siteSettingsToFormValues(record?.value);
}

export async function saveSiteSettings(settings: SiteSettings) {
  return db.siteSetting.upsert({
    where: { key: siteSettingsKey },
    update: { value: settings },
    create: { key: siteSettingsKey, value: settings },
  });
}
