import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const root = process.cwd();

describe("G1 mock exam UI", () => {
  it("ships a dedicated 40-question mock exam route with two 20-question sections", async () => {
    const page = await fs.readFile(path.join(root, "src", "app", "(public)", "g1-mock-exam", "page.tsx"), "utf8");
    const practicePage = await fs.readFile(path.join(root, "src", "app", "(public)", "practice", "page.tsx"), "utf8");

    assert.match(page, /buildG1MockExam/);
    assert.match(page, /40 questions/i);
    assert.match(page, /20 signs/i);
    assert.match(page, /20 rules/i);
    assert.match(page, /official-mto-drivers-handbook/i);
    assert.match(page, /experience="g1-mock-exam"/);
    assert.match(page, /key=\{attempt\}/);
    assert.doesNotMatch(page, /take:\s*100/);
    assert.match(practicePage, /href="\/g1-mock-exam"/);
  });

  it("keeps mock-exam feedback hidden until submission and reports both section results", async () => {
    const component = await fs.readFile(path.join(root, "src", "components", "quiz", "practice-quiz.tsx"), "utf8");

    assert.match(component, /scoreG1MockExam/);
    assert.match(component, /Signs:/);
    assert.match(component, /Rules:/);
    assert.match(component, /Answer all 40 questions/i);
    assert.match(component, /Mock exam passed/i);
    assert.match(component, /Keep practising/i);
    assert.match(component, /questions\.filter\(\(candidate\) => \(selection\[candidate\.id\]/);
  });

  it("provides direct question navigation and an unanswered-question review path", async () => {
    const component = await fs.readFile(path.join(root, "src", "components", "quiz", "practice-quiz.tsx"), "utf8");

    assert.match(component, /aria-label="Question navigation"/);
    assert.match(component, /aria-current=\{index === navigation\.activeIndex \? "step" : undefined\}/);
    assert.match(component, /unansweredIndexes/);
    assert.match(component, /Review unanswered/);
    assert.match(component, /setActiveIndex\(unansweredIndexes\[0\]\)/);
    assert.match(component, /answeredCount === questions\.length/);
  });
});
