import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";

const root = process.cwd();
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("critical learner accessibility", () => {
  it("provides a keyboard skip link that focuses the page main landmark", async () => {
    const [layout, skipLink] = await Promise.all([
      read("src/app/layout.tsx"),
      read("src/components/layout/skip-link.tsx"),
    ]);

    assert.match(layout, /<SkipLink\s*\/>/);
    assert.match(skipLink, /href="#main-content"/);
    assert.match(skipLink, /document\.querySelector<HTMLElement>\("main"\)/);
    assert.match(skipLink, /main\.focus\(\)/);
  });

  it("allows card and alert titles to use the correct heading level", async () => {
    const [card, alert, account, signIn, quiz, roadSigns] = await Promise.all([
      read("src/components/ui/card.tsx"),
      read("src/components/ui/alert.tsx"),
      read("src/app/(account)/account/page.tsx"),
      read("src/app/(auth)/sign-in/page.tsx"),
      read("src/components/quiz/practice-quiz.tsx"),
      read("src/app/(public)/road-signs/page.tsx"),
    ]);

    assert.match(card, /as:\s*Comp\s*=\s*"h3"/);
    assert.match(alert, /as:\s*Comp\s*=\s*"h3"/);
    assert.match(card, /React\.ElementType/);
    assert.match(alert, /React\.ElementType/);
    assert.match(account, /<CardTitle as="h2">Study plan settings/);
    assert.match(signIn, /<CardTitle as="h1">Sign in/);
    assert.match(quiz, /<CardTitle as="h2"[^>]*id="quiz-result-heading"/);
    assert.match(roadSigns, /<CardTitle as="h2">How to study these signs/);
  });

  it("keeps long action labels readable on narrow screens", async () => {
    const button = await read("src/components/ui/button.tsx");

    assert.doesNotMatch(button, /whitespace-nowrap/);
    assert.match(button, /whitespace-normal/);
    assert.match(button, /h-auto/);
  });

  it("groups licence goals and associates test-date instructions", async () => {
    const [profile, onboarding] = await Promise.all([
      read("src/components/account/learner-profile-form.tsx"),
      read("src/components/account/onboarding-form.tsx"),
    ]);

    assert.match(profile, /<fieldset/);
    assert.match(profile, /<legend/);
    assert.match(profile, /aria-describedby="target-test-date-help"/);
    assert.match(onboarding, /aria-describedby="onboarding-test-date-help"/);
  });

  it("associates mock-drive group instructions and restores context after saves", async () => {
    const [assessment, actions, checklist] = await Promise.all([
      read("src/components/road-test/mock-drive-assessment.tsx"),
      read("src/app/(public)/road-test/actions.ts"),
      read("src/components/road-test/road-test-checklist-progress-form.tsx"),
    ]);

    assert.match(assessment, /<fieldset[^>]*aria-describedby=\{`\$\{criterion\.id\}-description`\}/);
    assert.match(assessment, /id="mock-drive-assessment"[^>]*tabIndex=\{-1\}/);
    assert.match(actions, /#checklist-item-\$\{encodeURIComponent\(itemId\)\}/);
    assert.match(checklist, /id=\{`checklist-item-\$\{itemId\}`\}/);
    assert.match(checklist, /tabIndex=\{-1\}/);
  });

  it("marks current learner navigation and filters semantically", async () => {
    const [header, navigation, review] = await Promise.all([
      read("src/components/layout/site-header.tsx"),
      read("src/components/layout/site-navigation.tsx"),
      read("src/app/(public)/mistake-review/page.tsx"),
    ]);

    assert.match(header, /<SiteNavigation\s*\/>/);
    assert.match(navigation, /usePathname/);
    assert.match(navigation, /practiceRelatedPaths/);
    assert.match(navigation, /aria-current=\{isCurrent/);
    assert.match(review, /aria-current=\{option === stage \? "page" : undefined\}/);
    assert.match(review, /aria-current=\{requestedCategory/);
  });

  it("shows descriptive official Ontario sources only with submitted explanations", async () => {
    const [quiz, offline, model] = await Promise.all([
      read("src/components/quiz/practice-quiz.tsx"),
      read("src/components/pwa/offline-practice.tsx"),
      read("src/lib/learner/quiz.ts"),
    ]);

    assert.match(model, /sourceReference\?: string \| null/);
    assert.match(model, /sourceReference: question\.sourceReference/);
    assert.match(quiz, /submitted && officialSourceUrl/);
    assert.match(quiz, /Official Ontario guidance for \{question\.categoryName/);
    assert.doesNotMatch(quiz, /target="_blank"/);
    assert.match(offline, /submitted && officialSourceUrl/);
    assert.match(offline, /Official Ontario guidance for \{question\.categoryName/);
    assert.doesNotMatch(offline, /target="_blank"/);
  });

  it("restores the reported question after the report redirect", async () => {
    const [actions, quiz, practice] = await Promise.all([
      read("src/app/(public)/practice/report-actions.ts"),
      read("src/components/quiz/practice-quiz.tsx"),
      read("src/app/(public)/practice/page.tsx"),
    ]);

    assert.match(actions, /reportedQuestionId=\$\{encodeURIComponent\(parsed\.questionId\)\}/);
    assert.match(actions, /#question-\$\{encodeURIComponent\(parsed\.questionId\)\}-heading/);
    assert.match(quiz, /initialQuestionId\?: string/);
    assert.match(quiz, /questions\.findIndex\(\(candidate\) => candidate\.id === initialQuestionId\)/);
    assert.match(practice, /initialQuestionId=\{params\.reportedQuestionId\}/);
  });

  it("announces dashboard save confirmations as status messages", async () => {
    const dashboard = await read("src/app/dashboard/page.tsx");

    assert.match(dashboard, /params\.saved === "quiz"[^\n]*aria-live="polite"[^\n]*role="status"/);
    assert.match(dashboard, /params\.saved === "checklist"[^\n]*aria-live="polite"[^\n]*role="status"/);
  });
});
