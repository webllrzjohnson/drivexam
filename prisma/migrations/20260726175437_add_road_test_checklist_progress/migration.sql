-- CreateTable
CREATE TABLE "RoadTestChecklistProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoadTestChecklistProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RoadTestChecklistProgress_userId_completedAt_idx" ON "RoadTestChecklistProgress"("userId", "completedAt");

-- CreateIndex
CREATE INDEX "RoadTestChecklistProgress_itemId_idx" ON "RoadTestChecklistProgress"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "RoadTestChecklistProgress_userId_itemId_key" ON "RoadTestChecklistProgress"("userId", "itemId");

-- AddForeignKey
ALTER TABLE "RoadTestChecklistProgress" ADD CONSTRAINT "RoadTestChecklistProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadTestChecklistProgress" ADD CONSTRAINT "RoadTestChecklistProgress_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "RoadTestChecklistItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
