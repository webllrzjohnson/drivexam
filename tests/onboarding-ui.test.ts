import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";

const root = process.cwd();
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("guided learner onboarding", () => {
  it("ships an authenticated first-run setup with stage-specific next steps", async () => {
    const [page, form, actions] = await Promise.all([
      read("src/app/(account)/onboarding/page.tsx"),
      read("src/components/account/onboarding-form.tsx"),
      read("src/app/(account)/onboarding/actions.ts"),
    ]);

    assert.match(page, /getCurrentUser/);
    assert.match(page, /emailVerified/);
    assert.match(page, /currentStage/);
    assert.match(page, /redirect\("\/dashboard"\)/);
    assert.match(page, /<OnboardingForm/);
    assert.match(form, /G1 knowledge test/);
    assert.match(form, /G2 road test/);
    assert.match(form, /Full G road test/);
    assert.match(form, /targetTestDate/);
    assert.match(form, /Start with a realistic 40-question mock exam/);
    assert.match(actions, /normalizeLearnerProfileForm/);
    assert.match(actions, /getOnboardingDestination/);
    assert.match(actions, /where: \{ id: user\.id \}/);
    assert.match(actions, /redirect\(getOnboardingDestination/);
  });

  it("routes incomplete regular learners into setup", async () => {
    const [dashboard, authActions] = await Promise.all([
      read("src/app/dashboard/page.tsx"),
      read("src/app/(auth)/actions.ts"),
    ]);

    assert.match(dashboard, /shouldRequireLearnerOnboarding\(user\.role, learnerProfile\?\.currentStage/);
    assert.match(authActions, /currentStage: true/);
    assert.match(authActions, /shouldRequireLearnerOnboarding\(user\.role, user\.currentStage\)/);
  });
});
