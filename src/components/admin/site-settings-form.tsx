import type { SiteSettings } from "@/lib/admin/site-settings";
import { updateSiteSettings } from "@/app/admin/settings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SiteSettingsFormProps = {
  settings: SiteSettings;
};

function Field({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

export function SiteSettingsForm({ settings }: SiteSettingsFormProps) {
  return (
    <form action={updateSiteSettings} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <Label htmlFor="siteName">Site name</Label>
          <Input id="siteName" name="siteName" required defaultValue={settings.siteName} />
        </Field>
        <Field>
          <Label htmlFor="contactEmail">Contact email</Label>
          <Input id="contactEmail" name="contactEmail" required type="email" defaultValue={settings.contactEmail} />
        </Field>
      </div>

      <Field>
        <Label htmlFor="tagline">Tagline</Label>
        <Input id="tagline" name="tagline" required defaultValue={settings.tagline} />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <Label htmlFor="homepageHeroTitle">Homepage hero title</Label>
          <Input id="homepageHeroTitle" name="homepageHeroTitle" required defaultValue={settings.homepageHeroTitle} />
        </Field>
        <Field>
          <Label htmlFor="supportUrl">Support URL</Label>
          <Input id="supportUrl" name="supportUrl" required defaultValue={settings.supportUrl} />
        </Field>
      </div>

      <Field>
        <Label htmlFor="homepageHeroSubtitle">Homepage hero subtitle</Label>
        <textarea
          className="min-h-24 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-green-700"
          id="homepageHeroSubtitle"
          name="homepageHeroSubtitle"
          required
          defaultValue={settings.homepageHeroSubtitle}
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <Label htmlFor="seoTitle">SEO title</Label>
          <Input id="seoTitle" name="seoTitle" required defaultValue={settings.seoTitle} />
        </Field>
        <Field>
          <Label htmlFor="seoDescription">SEO description</Label>
          <Input id="seoDescription" name="seoDescription" required defaultValue={settings.seoDescription} />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <Label htmlFor="facebookUrl">Facebook URL</Label>
          <Input id="facebookUrl" name="facebookUrl" defaultValue={settings.facebookUrl} placeholder="https://facebook.com/..." />
        </Field>
        <Field>
          <Label htmlFor="instagramUrl">Instagram URL</Label>
          <Input id="instagramUrl" name="instagramUrl" defaultValue={settings.instagramUrl} placeholder="https://instagram.com/..." />
        </Field>
      </div>

      <Button type="submit">Save site settings</Button>
    </form>
  );
}
