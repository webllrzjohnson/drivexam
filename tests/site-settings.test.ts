import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  defaultSiteSettings,
  parseSiteSettingsForm,
  siteSettingsKey,
  siteSettingsToFormValues,
} from "../src/lib/admin/site-settings";

describe("admin site settings helpers", () => {
  it("uses a stable database key", () => {
    assert.equal(siteSettingsKey, "site");
  });

  it("normalizes form values into stored site settings", () => {
    const formData = new FormData();
    formData.set("siteName", "  DriveExam Ontario  ");
    formData.set("tagline", "  Pass your G1 with confidence.  ");
    formData.set("homepageHeroTitle", " Ontario driver exam prep ");
    formData.set("homepageHeroSubtitle", " Study G1, G2, and full G skills. ");
    formData.set("contactEmail", " HELP@DRIVEXAM.CA ");
    formData.set("seoTitle", " DriveExam | Ontario G1 Practice ");
    formData.set("seoDescription", " Practice for Ontario tests. ");
    formData.set("facebookUrl", " https://facebook.com/drivexam ");
    formData.set("instagramUrl", "");
    formData.set("supportUrl", " /contact ");

    assert.deepEqual(parseSiteSettingsForm(formData), {
      siteName: "DriveExam Ontario",
      tagline: "Pass your G1 with confidence.",
      homepageHeroTitle: "Ontario driver exam prep",
      homepageHeroSubtitle: "Study G1, G2, and full G skills.",
      contactEmail: "help@drivexam.ca",
      seoTitle: "DriveExam | Ontario G1 Practice",
      seoDescription: "Practice for Ontario tests.",
      facebookUrl: "https://facebook.com/drivexam",
      instagramUrl: "",
      supportUrl: "/contact",
    });
  });

  it("requires a valid contact email", () => {
    const formData = new FormData();
    formData.set("siteName", defaultSiteSettings.siteName);
    formData.set("tagline", defaultSiteSettings.tagline);
    formData.set("homepageHeroTitle", defaultSiteSettings.homepageHeroTitle);
    formData.set("homepageHeroSubtitle", defaultSiteSettings.homepageHeroSubtitle);
    formData.set("contactEmail", "not an email");
    formData.set("seoTitle", defaultSiteSettings.seoTitle);
    formData.set("seoDescription", defaultSiteSettings.seoDescription);
    formData.set("supportUrl", defaultSiteSettings.supportUrl);

    assert.throws(() => parseSiteSettingsForm(formData), /valid contact email/);
  });

  it("falls back to defaults when stored JSON is incomplete", () => {
    const formValues = siteSettingsToFormValues({ siteName: "Custom name" });

    assert.equal(formValues.siteName, "Custom name");
    assert.equal(formValues.contactEmail, defaultSiteSettings.contactEmail);
    assert.equal(formValues.homepageHeroTitle, defaultSiteSettings.homepageHeroTitle);
  });
});
