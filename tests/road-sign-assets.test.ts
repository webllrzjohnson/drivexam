import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildStoredAssetPath,
  getAssetTypeOptions,
  parseRoadSignAssetMetadata,
  sanitizeAssetFilename,
} from "../src/lib/admin/road-sign-assets";

describe("admin road sign asset helpers", () => {
  it("normalizes asset metadata from form values", () => {
    const formData = new FormData();
    formData.set("title", "  Stop Sign  ");
    formData.set("category", " Regulatory Signs ");
    formData.set("description", " Red octagon stop sign. ");
    formData.set("sourceCredit", " Ontario Traffic Manual ");
    formData.set("type", "ROAD_SIGN");

    assert.deepEqual(parseRoadSignAssetMetadata(formData), {
      title: "Stop Sign",
      category: "Regulatory Signs",
      description: "Red octagon stop sign.",
      sourceCredit: "Ontario Traffic Manual",
      type: "ROAD_SIGN",
    });
  });

  it("requires a title and valid asset type", () => {
    const formData = new FormData();
    formData.set("title", "");
    formData.set("type", "PDF");

    assert.throws(() => parseRoadSignAssetMetadata(formData), /title/i);

    formData.set("title", "Stop sign");
    assert.throws(() => parseRoadSignAssetMetadata(formData), /valid asset type/i);
  });

  it("sanitizes uploaded file names", () => {
    assert.equal(sanitizeAssetFilename(" My Stop Sign.PNG "), "my-stop-sign.png");
    assert.equal(sanitizeAssetFilename("../../bad file.svg"), "bad-file.svg");
  });

  it("builds stored public-style asset paths by type", () => {
    assert.equal(buildStoredAssetPath({ type: "ROAD_SIGN", filename: "stop.png" }), "road-signs/stop.png");
    assert.equal(buildStoredAssetPath({ type: "LOGO", filename: "logo.svg" }), "branding/logo.svg");
  });

  it("exposes only image asset type options", () => {
    assert.deepEqual(getAssetTypeOptions().map((option) => option.value), ["ROAD_SIGN", "LOGO", "FAVICON", "BLOG_IMAGE", "CONTENT_IMAGE", "OTHER"]);
  });
});
