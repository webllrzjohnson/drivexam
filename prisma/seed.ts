import { db } from "../src/lib/db";
import { hashPassword } from "../src/lib/auth/password";
import { ontarioG1SeedCategories, ontarioG1SeedQuestions } from "../src/lib/seed/ontario-g1-content";
import {
  ontarioRoadTestChecklistItems,
  ontarioRoadTestSeedCategories,
  ontarioRoadTestSeedQuestions,
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

async function seedOntarioG1Content() {
  const categories = new Map<string, string>();

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

  const seedPrompts = ontarioG1SeedQuestions.map((question) => question.prompt);
  await db.question.deleteMany({ where: { prompt: { in: seedPrompts }, sourceReference: { not: null } } });

  for (const [questionIndex, question] of ontarioG1SeedQuestions.entries()) {
    const categoryId = categories.get(question.categorySlug);
    if (!categoryId) throw new Error(`Missing seeded category for ${question.categorySlug}`);

    await db.question.create({
      data: {
        type: "MULTIPLE_CHOICE",
        prompt: question.prompt,
        explanation: question.explanation,
        stage: "G1",
        categoryId,
        status: "PUBLISHED",
        selectCount: 1,
        sourceReference: question.sourceReference,
        publishedAt: new Date(),
        choices: {
          create: question.choices.map((choice, choiceIndex) => ({
            text: choice.text,
            isCorrect: choice.isCorrect,
            sortOrder: choiceIndex + 1,
          })),
        },
      },
    });

    if ((questionIndex + 1) % 10 === 0) console.info(`Seeded ${questionIndex + 1} Ontario G1 questions...`);
  }

  console.info(`Seeded ${ontarioG1SeedCategories.length} Ontario G1 categories and ${ontarioG1SeedQuestions.length} published questions.`);
}

async function seedOntarioRoadTestContent() {
  const categories = new Map<string, string>();

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

  const seedPrompts = ontarioRoadTestSeedQuestions.map((question) => question.prompt);
  await db.question.deleteMany({ where: { prompt: { in: seedPrompts }, sourceReference: { not: null } } });

  for (const question of ontarioRoadTestSeedQuestions) {
    const categoryId = categories.get(question.categorySlug);
    if (!categoryId) throw new Error(`Missing seeded category for ${question.categorySlug}`);

    await db.question.create({
      data: {
        type: "MULTIPLE_CHOICE",
        prompt: question.prompt,
        explanation: question.explanation,
        stage: question.stage,
        categoryId,
        status: "PUBLISHED",
        selectCount: 1,
        sourceReference: question.sourceReference,
        publishedAt: new Date(),
        choices: {
          create: question.choices.map((choice, choiceIndex) => ({
            text: choice.text,
            isCorrect: choice.isCorrect,
            sortOrder: choiceIndex + 1,
          })),
        },
      },
    });
  }

  const checklistTitles = ontarioRoadTestChecklistItems.map((item) => item.title);
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
