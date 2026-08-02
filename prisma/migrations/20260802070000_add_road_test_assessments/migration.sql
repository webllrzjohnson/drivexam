-- CreateEnum
CREATE TYPE "RoadTestAssessmentVerdict" AS ENUM ('NEEDS_PRACTICE', 'NEARLY_READY', 'READY');

-- CreateTable
CREATE TABLE "RoadTestAssessment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stage" "LicenseStage" NOT NULL,
    "percent" INTEGER NOT NULL,
    "verdict" "RoadTestAssessmentVerdict" NOT NULL,
    "criticalErrorCount" INTEGER NOT NULL,
    "ratings" JSONB NOT NULL,
    "priorityIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoadTestAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RoadTestAssessment_userId_stage_createdAt_idx" ON "RoadTestAssessment"("userId", "stage", "createdAt");

-- AddForeignKey
ALTER TABLE "RoadTestAssessment" ADD CONSTRAINT "RoadTestAssessment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
