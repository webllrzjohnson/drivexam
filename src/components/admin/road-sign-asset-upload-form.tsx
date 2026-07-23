import { uploadRoadSignAsset } from "@/app/admin/assets/actions";
import { getAssetTypeOptions } from "@/lib/admin/road-sign-assets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Field({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

export function RoadSignAssetUploadForm() {
  return (
    <form action={uploadRoadSignAsset} className="space-y-5 rounded-xl border bg-white p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" placeholder="Stop sign" required />
        </Field>
        <Field>
          <Label htmlFor="type">Asset type</Label>
          <select className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm" defaultValue="ROAD_SIGN" id="type" name="type">
            {getAssetTypeOptions().map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <Label htmlFor="category">Category</Label>
          <Input id="category" name="category" placeholder="Regulatory signs" />
        </Field>
        <Field>
          <Label htmlFor="sourceCredit">Source / credit</Label>
          <Input id="sourceCredit" name="sourceCredit" placeholder="Ontario Traffic Manual, public source, or photographer" />
        </Field>
      </div>

      <Field>
        <Label htmlFor="description">Description</Label>
        <textarea className="min-h-20 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-green-700" id="description" name="description" placeholder="Describe the sign and how it should be used in questions." />
      </Field>

      <Field>
        <Label htmlFor="file">Image file</Label>
        <Input accept="image/jpeg,image/png,image/webp,image/svg+xml" id="file" name="file" required type="file" />
        <p className="text-xs text-slate-500">Accepted: JPG, PNG, WebP, SVG. Max 5 MB.</p>
      </Field>

      <Button type="submit">Upload asset</Button>
    </form>
  );
}
