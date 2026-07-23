import { ModulePage } from "@/components/admin/module-page";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";
import { getSiteSettings } from "@/lib/admin/site-settings";

type SettingsPageProps = {
  searchParams: Promise<{ updated?: string }>;
};

export default async function Page({ searchParams }: SettingsPageProps) {
  const [settings, params] = await Promise.all([getSiteSettings(), searchParams]);

  return (
    <ModulePage slug="settings">
      <div className="space-y-5">
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-950">
          <p className="font-semibold">Core site settings are live.</p>
          <p>Manage public branding, homepage copy, contact details, social links, and SEO defaults from the admin area.</p>
        </div>
        {params.updated === "settings" ? (
          <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900">Site settings saved.</p>
        ) : null}
        <SiteSettingsForm settings={settings} />
      </div>
    </ModulePage>
  );
}
