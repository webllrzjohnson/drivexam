-- Preserve one synchronized copy of each browser-local attempt per user.
ALTER TABLE "QuizAttempt" ADD COLUMN "clientAttemptId" TEXT;

CREATE UNIQUE INDEX "QuizAttempt_userId_clientAttemptId_key"
ON "QuizAttempt"("userId", "clientAttemptId");

-- Give questions and choices durable public identities. Existing rows inherit
-- their current primary key once; bundled seed content receives maintained IDs
-- during the next idempotent seed run.
ALTER TABLE "Question" ADD COLUMN "publicId" TEXT;
UPDATE "Question" SET "publicId" = "id" WHERE "publicId" IS NULL;
ALTER TABLE "Question" ALTER COLUMN "publicId" SET NOT NULL;
CREATE UNIQUE INDEX "Question_publicId_key" ON "Question"("publicId");

ALTER TABLE "AnswerChoice" ADD COLUMN "publicId" TEXT;
UPDATE "AnswerChoice" SET "publicId" = "id" WHERE "publicId" IS NULL;
ALTER TABLE "AnswerChoice" ALTER COLUMN "publicId" SET NOT NULL;
CREATE UNIQUE INDEX "AnswerChoice_publicId_key" ON "AnswerChoice"("publicId");

-- Preserve historical attempt-answer snapshots if a question is retired.
ALTER TABLE "QuizAttemptAnswer" DROP CONSTRAINT "QuizAttemptAnswer_questionId_fkey";
ALTER TABLE "QuizAttemptAnswer" ALTER COLUMN "questionId" DROP NOT NULL;
ALTER TABLE "QuizAttemptAnswer" ADD CONSTRAINT "QuizAttemptAnswer_questionId_fkey"
FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;