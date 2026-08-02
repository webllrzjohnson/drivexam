import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";

const root = process.cwd();
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("saved mock-drive assessment history", () => {
  it("stores owner-scoped stage results and server-computed evidence", async () => {
    const [schema, migration] = await Promise.all([
      read("prisma/schema.prisma"),
      read("prisma/migrations/20260802070000_add_road_test_assessments/migration.sql"),
    ]);

    assert.match(schema, /model RoadTestAssessment \{/);
    assert.match(schema, /roadTestAssessments RoadTestAssessment\[\]/);
    assert.match(schema, /stage\s+LicenseStage/);
    assert.match(schema, /ratings\s+Json/);
    assert.match(schema, /priorityIds\s+String\[\]/);
    assert.match(schema, /clientAssessmentId\s+String/);
    assert.match(schema, /@@unique\(\[userId, clientAssessmentId\]\)/);
    assert.match(schema, /@@index\(\[userId, stage, createdAt\]\)/);
    assert.match(migration, /CREATE TABLE "RoadTestAssessment"/);
    assert.match(migration, /REFERENCES "User"\("id"\) ON DELETE CASCADE/);
  });

  it("saves only server-recomputed results for the verified owner", async () => {
    const actions = await read("src/app/(public)/road-test/actions.ts");

    assert.match(actions, /export async function saveMockDriveAssessment/);
    assert.match(actions, /requireVerifiedUser\(\)/);
    assert.match(actions, /normalizeMockDriveAssessmentSubmission\(formData\)/);
    assert.match(actions, /roadTestAssessment\.create/);
    assert.match(actions, /PrismaClientKnownRequestError/);
    assert.match(actions, /error\.code !== "P2002"/);
    assert.match(actions, /doesSavedMockDriveAssessmentMatchSubmission/);
    assert.match(actions, /userId: user\.id/);
    assert.match(actions, /percent: parsed\.data\.result\.percent/);
    assert.match(actions, /verdict: parsed\.data\.result\.verdict/);
    assert.match(actions, /priorityIds: parsed\.data\.result\.priorities/);
  });

  it("shows a verified-user save action and bounded stage history", async () => {
    const [page, component] = await Promise.all([
      read("src/app/(public)/road-test/page.tsx"),
      read("src/components/road-test/mock-drive-assessment.tsx"),
    ]);

    assert.match(page, /roadTestAssessment\.findMany/);
    assert.match(page, /userId: user\.id/);
    assert.match(page, /stage/);
    assert.match(page, /take: 5/);
    assert.match(page, /recentAssessments=/);
    assert.match(component, /action=\{saveMockDriveAssessment\}/);
    assert.match(component, /name="ratings"/);
    assert.match(component, /name="criticalErrorCount"/);
    assert.match(component, /Recent saved mock drives/);
  });

  it("adds bounded saved-drive readiness summaries to the learner dashboard", async () => {
    const [page, shell, component, roadTestPage] = await Promise.all([
      read("src/app/dashboard/page.tsx"),
      read("src/components/dashboard/dashboard-shell.tsx"),
      read("src/components/road-test/mock-drive-assessment.tsx"),
      read("src/app/(public)/road-test/page.tsx"),
    ]);

    assert.match(page, /roadTestAssessment\.findMany/);
    assert.match(page, /where: \{ userId: user\.id, stage: "G2" \}/);
    assert.match(page, /where: \{ userId: user\.id, stage: "G" \}/);
    assert.match(page, /take: 10/g);
    assert.match(page, /roadTestAssessment\.groupBy/);
    assert.match(page, /_count: \{ _all: true \}/);
    assert.match(page, /_max: \{ percent: true \}/);
    assert.match(page, /roadTestAssessmentHistory = \[\.\.\.g2AssessmentHistory, \.\.\.gAssessmentHistory\]/);
    assert.match(page, /buildRoadTestAssessmentProgressSummary/);
    assert.match(page, /roadTestAssessments=\{roadTestAssessments\}/);
    assert.match(shell, /Mock-drive readiness/);
    assert.doesNotMatch(component, /Sign in to save this result/);
    assert.match(component, /Sign in to save future mock drives/);
    assert.match(component, /useFormStatus/);
    assert.match(component, /America\/Toronto/);
    assert.match(roadTestPage, /params\.saved === "drive" && canSaveProgress/);
    assert.match(shell, /assessmentCount/);
    assert.match(shell, /trendPoints/);
  });
});
