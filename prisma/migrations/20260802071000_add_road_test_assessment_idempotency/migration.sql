-- AlterTable
ALTER TABLE "RoadTestAssessment" ADD COLUMN "clientAssessmentId" TEXT;

-- Backfill any rows created before idempotency was introduced.
UPDATE "RoadTestAssessment" SET "clientAssessmentId" = "id" WHERE "clientAssessmentId" IS NULL;

-- AlterTable
ALTER TABLE "RoadTestAssessment" ALTER COLUMN "clientAssessmentId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RoadTestAssessment_userId_clientAssessmentId_key" ON "RoadTestAssessment"("userId", "clientAssessmentId");
