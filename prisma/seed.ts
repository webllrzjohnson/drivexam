import type { LicenseStage } from "@prisma/client";

import { db } from "../src/lib/db";
import { hashPassword } from "../src/lib/auth/password";
import {
  ontarioG1RoadSignAssets,
  ontarioG1SeedCategories,
  ontarioG1SeedQuestions,
  retiredOntarioG1SeedPrompts,
} from "../src/lib/seed/ontario-g1-content";
import {
  ontarioRoadTestChecklistItems,
  ontarioRoadTestIllustrationAssets,
  ontarioRoadTestSeedCategories,
  ontarioRoadTestSeedQuestions,
  retiredOntarioRoadTestChecklistTitles,
  retiredOntarioRoadTestSeedPrompts,
} from "../src/lib/seed/ontario-road-test-content";

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL?.toLowerCase();
  const name = process.env.SEED_ADMIN_NAME || "drivexam Admin";
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    console.info("Admin seed skipped: set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to create the first admin.");
    return;
  }

  const passwordHash = await hashPassword(password);

  await db.user.upsert({
    where: { email },
    update: { name, role: "ADMIN", emailVerified: new Date(), deletedAt: null, passwordHash },
    create: { email, name, role: "ADMIN", emailVerified: new Date(), passwordHash },
  });

  console.info("Seeded admin user from SEED_ADMIN_EMAIL.");
}

type DurableSeedQuestion = {
  publicId: string;
  sourceReference: string;
  prompt: string;
  explanation: string;
  choices: Array<{ publicId: string; text: string; isCorrect: boolean }>;
};

async function reconcileSeedQuestion({
  question,
  stage,
  categoryId,
  questionAssets,
}: {
  question: DurableSeedQuestion;
  stage: LicenseStage;
  categoryId: string;
  questionAssets: Array<{ assetId: string; sortOrder: number }>;
}) {
  const existing = await db.question.findFirst({
    where: {
      OR: [{ publicId: question.publicId }, { prompt: question.prompt }],
      sourceReference: { not: null },
    },
    select: { id: true },
  });

  const saved = existing
    ? await db.question.update({
        where: { id: existing.id },
        data: {
          publicId: question.publicId,
          type: "MULTIPLE_CHOICE",
          prompt: question.prompt,
          explanation: question.explanation,
          stage,
          categoryId,
          status: "PUBLISHED",
          selectCount: 1,
          sourceReference: question.sourceReference,
        },
      })
    : await db.question.create({
        data: {
          publicId: question.publicId,
          type: "MULTIPLE_CHOICE",
          prompt: question.prompt,
          explanation: question.explanation,
          stage,
          categoryId,
          status: "PUBLISHED",
          selectCount: 1,
          sourceReference: question.sourceReference,
          publishedAt: new Date(),
        },
      });

  await db.questionAsset.deleteMany({ where: { questionId: saved.id } });
  if (questionAssets.length) await db.questionAsset.createMany({ data: questionAssets.map((asset) => ({ ...asset, questionId: saved.id })) });

  for (const [choiceIndex, choice] of question.choices.entries()) {
    const existingChoice = await db.answerChoice.findFirst({
      where: {
        OR: [{ publicId: choice.publicId }, { questionId: saved.id, text: choice.text }],
      },
      select: { id: true },
    });
    const data = {
      publicId: choice.publicId,
      questionId: saved.id,
      text: choice.text,
      isCorrect: choice.isCorrect,
      sortOrder: choiceIndex + 1,
    };
    if (existingChoice) await db.answerChoice.update({ where: { id: existingChoice.id }, data });
    else await db.answerChoice.create({ data });
  }

  await db.answerChoice.deleteMany({
    where: { questionId: saved.id, publicId: { notIn: question.choices.map((choice) => choice.publicId) } },
  });
}

async function seedOntarioG1Content() {
  const categories = new Map<string, string>();
  const assets = new Map<string, string>();

  for (const category of ontarioG1SeedCategories) {
    const saved = await db.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        stage: "G1",
        sortOrder: category.sortOrder,
        isActive: true,
      },
      create: {
        slug: category.slug,
        name: category.name,
        description: category.description,
        stage: "G1",
        sortOrder: category.sortOrder,
        isActive: true,
      },
    });
    categories.set(category.slug, saved.id);
  }

  await db.uploadAsset.deleteMany({ where: { category: "Ontario G1 road signs" } });

  for (const asset of ontarioG1RoadSignAssets) {
    const saved = await db.uploadAsset.create({
      data: {
        type: "ROAD_SIGN",
        filename: asset.filename,
        path: asset.path,
        mimeType: asset.mimeType,
        sizeBytes: asset.sizeBytes,
        title: asset.title,
        category: "Ontario G1 road signs",
        description: asset.description,
        sourceCredit: asset.sourceCredit,
      },
    });
    assets.set(asset.slug, saved.id);
  }

  await db.question.deleteMany({ where: { prompt: { in: [...retiredOntarioG1SeedPrompts] }, sourceReference: { not: null } } });

  for (const [questionIndex, question] of ontarioG1SeedQuestions.entries()) {
    const categoryId = categories.get(question.categorySlug);
    if (!categoryId) throw new Error(`Missing seeded category for ${question.categorySlug}`);

    const questionAssets = (question.assetSlugs ?? []).map((slug, assetIndex) => {
      const assetId = assets.get(slug);
      if (!assetId) throw new Error(`Missing seeded road-sign asset for ${slug}`);
      return { assetId, sortOrder: assetIndex + 1 };
    });

    await reconcileSeedQuestion({ question, stage: "G1", categoryId, questionAssets });

    if ((questionIndex + 1) % 10 === 0) console.info(`Seeded ${questionIndex + 1} Ontario G1 questions...`);
  }

  console.info(`Seeded ${ontarioG1SeedCategories.length} Ontario G1 categories and ${ontarioG1SeedQuestions.length} published questions.`);
}

async function seedOntarioRoadTestContent() {
  const categories = new Map<string, string>();
  const assets = new Map<string, string>();

  for (const category of ontarioRoadTestSeedCategories) {
    const saved = await db.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        stage: category.stage,
        sortOrder: category.sortOrder,
        isActive: true,
      },
      create: {
        slug: category.slug,
        name: category.name,
        description: category.description,
        stage: category.stage,
        sortOrder: category.sortOrder,
        isActive: true,
      },
    });
    categories.set(category.slug, saved.id);
  }

  await db.uploadAsset.deleteMany({ where: { category: "Ontario road-test illustrations" } });

  for (const asset of ontarioRoadTestIllustrationAssets) {
    const saved = await db.uploadAsset.create({
      data: {
        type: "CONTENT_IMAGE",
        filename: asset.filename,
        path: asset.path,
        mimeType: asset.mimeType,
        sizeBytes: asset.sizeBytes,
        title: asset.title,
        category: "Ontario road-test illustrations",
        description: asset.description,
        sourceCredit: asset.sourceCredit,
      },
    });
    assets.set(asset.slug, saved.id);
  }

  await db.question.deleteMany({ where: { prompt: { in: [...retiredOntarioRoadTestSeedPrompts] }, sourceReference: { not: null } } });

  for (const question of ontarioRoadTestSeedQuestions) {
    const categoryId = categories.get(question.categorySlug);
    if (!categoryId) throw new Error(`Missing seeded category for ${question.categorySlug}`);

    const questionAssets = (question.assetSlugs ?? []).map((slug, assetIndex) => {
      const assetId = assets.get(slug);
      if (!assetId) throw new Error(`Missing seeded road-test illustration for ${slug}`);
      return { assetId, sortOrder: assetIndex + 1 };
    });

    await reconcileSeedQuestion({ question, stage: question.stage, categoryId, questionAssets });
  }

  const checklistTitles = [...ontarioRoadTestChecklistItems.map((item) => item.title), ...retiredOntarioRoadTestChecklistTitles];
  await db.roadTestChecklistItem.deleteMany({ where: { title: { in: checklistTitles } } });

  for (const item of ontarioRoadTestChecklistItems) {
    const categoryId = categories.get(item.categorySlug);
    if (!categoryId) throw new Error(`Missing seeded category for ${item.categorySlug}`);

    await db.roadTestChecklistItem.create({
      data: {
        stage: item.stage,
        section: item.section,
        title: item.title,
        description: `${item.description}\n\nSource: ${item.sourceReference}`,
        categoryId,
        sortOrder: item.sortOrder,
        isActive: true,
      },
    });
  }

  console.info(
    `Seeded ${ontarioRoadTestSeedCategories.length} Ontario G2/G categories, ${ontarioRoadTestSeedQuestions.length} published questions, and ${ontarioRoadTestChecklistItems.length} checklist items.`,
  );
}

async function main() {
  await seedAdmin();
  await seedOntarioG1Content();
  await seedOntarioRoadTestContent();
}

main().finally(async () => db.$disconnect());
