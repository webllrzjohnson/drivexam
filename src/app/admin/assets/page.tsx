import { ModulePage } from "@/components/admin/module-page";
import { RoadSignAssetUploadForm } from "@/components/admin/road-sign-asset-upload-form";
import { db } from "@/lib/db";

type AssetsPageProps = {
  searchParams: Promise<{ uploaded?: string }>;
};

function formatBytes(sizeBytes: number) {
  if (sizeBytes < 1024) return `${sizeBytes} B`;
  if (sizeBytes < 1024 * 1024) return `${Math.round(sizeBytes / 1024)} KB`;
  return `${(sizeBytes / 1024 / 1024).toFixed(1)} MB`;
}

export default async function Page({ searchParams }: AssetsPageProps) {
  const [params, assets] = await Promise.all([
    searchParams,
    db.uploadAsset.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        type: true,
        title: true,
        category: true,
        description: true,
        sourceCredit: true,
        filename: true,
        path: true,
        mimeType: true,
        sizeBytes: true,
        createdAt: true,
      },
    }),
  ]);

  return (
    <ModulePage slug="assets">
      <div className="space-y-6">
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-950">
          <p className="font-semibold">Road sign asset management is live.</p>
          <p>Upload reusable Ontario road-sign images and keep source/license credit beside each file.</p>
        </div>
        {params.uploaded === "asset" ? (
          <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900">Asset uploaded.</p>
        ) : null}

        <RoadSignAssetUploadForm />

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Latest assets</h3>
          <div className="overflow-hidden rounded-xl border bg-white">
            {assets.length ? (
              assets.map((asset) => (
                <div className="grid gap-3 border-b p-4 last:border-b-0 md:grid-cols-[1.2fr_0.7fr_1.2fr]" key={asset.id}>
                  <div>
                    <p className="font-medium text-slate-950">{asset.title ?? asset.filename}</p>
                    <p className="text-sm text-slate-600">{asset.category ?? "Uncategorized"} · {asset.type}</p>
                    {asset.description ? <p className="mt-1 text-sm text-slate-600">{asset.description}</p> : null}
                  </div>
                  <div className="text-sm text-slate-600">
                    <p>{formatBytes(asset.sizeBytes)}</p>
                    <p>{asset.mimeType}</p>
                  </div>
                  <div className="text-sm text-slate-600">
                    <p className="break-all font-mono text-xs">{asset.path}</p>
                    {asset.sourceCredit ? <p className="mt-1">Credit: {asset.sourceCredit}</p> : null}
                  </div>
                </div>
              ))
            ) : (
              <p className="px-4 py-8 text-center text-sm text-slate-600">No assets uploaded yet.</p>
            )}
          </div>
        </div>
      </div>
    </ModulePage>
  );
}
