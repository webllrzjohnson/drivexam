# drivexam Product Plan

> **Status:** Discovery/product plan only. Do not start implementation until Louie approves.

**Goal:** Build a trustworthy Ontario-only driving exam study companion that guides users from G1 to G2 to full G with realistic practice, study planning, road-test prep, and progress motivation.

**Architecture Direction:** Web-first, mobile-friendly, installable PWA using Next.js 15, Prisma, Postgres, Auth.js/NextAuth, Tailwind, and shadcn/ui. V1 focuses on the free/registered learning experience, admin-managed content, and a complete G1/G2/G path. AI, payments, AdSense, analytics, and deeper offline support come later.

**Repo:** `https://github.com/webllrzjohnson/drivexam.git`

**Local Path:** `D:\Factory\drivexam`

---

## 1. Product Positioning

### Product Name

Use **drivexam** for now.

### Product Type

A full Ontario driving-license preparation companion, not just a quiz app.

### Primary Audience

People preparing for Ontario driver licensing stages:

- G1 written test
- G2 road test
- Full G road test

### Product Promise

Help users know what to study, practice realistic questions, understand their mistakes, track readiness, and prepare confidently for each Ontario licensing stage.

### Differentiators

- Guided path from G1 → G2 → G
- Realistic Ontario-style practice questions
- Personalized daily study plans
- Better mistake explanations
- Road-test checklists and common fail reasons
- Clean mobile-first design
- Newcomer-friendly plain English
- Readiness scores and encouragement
- Admin-managed content quality workflow

---

## 2. Version 1 Scope

V1 should feel complete across all three stages:

- G1
- G2
- Full G

No placeholder-only G2/G sections. If features are simpler in V1, they should still provide real value.

### Included in V1

- Public marketing homepage
- Public limited study/quiz previews
- Public blog/news
- Public FAQ/legal pages
- Registration/login
- Google login
- Email verification
- Password reset
- User dashboard
- Daily study plan
- Lessons + practice questions
- Readiness scores
- Timed mock exams
- Pause/resume support
- Mistake review and retry
- Road-test prep checklists
- Road-test self-assessment/mock scoring if practical
- Streaks and streak-freeze system
- Achievements/badges/certificates
- Admin CMS
- Author/admin roles
- Draft/review workflow
- Question reporting
- Contact form for verified users
- Local uploads
- PWA install support

### Deferred Until Later

- AI tutor
- Payments/paid upgrades
- AdSense ads
- Analytics
- Full offline studying/quizzes
- Native mobile app
- Public achievement pages
- Blog/news comments
- Notifications/reminders

---

## 3. Access Model

### Unregistered Public Users

Public users can access limited versions of:

- Practice questions
- Road-sign flashcards
- Sample mock exam
- Road-test checklist preview
- Handbook-style lessons
- Basic explanations
- Public blog/news
- FAQ/legal pages
- Question reporting

Goal: give enough value to build trust while encouraging registration.

### Registered Verified Users

Verified users unlock:

- Saved progress
- Dashboard
- Daily study plan
- Readiness scores
- Weak-area tracking
- Mistake review
- Mistake-only practice
- Stage progress
- Streaks/streak freezes
- Achievements/badges/certificates
- Contact form access

### Authentication Requirements

- Email/password signup
- Google login
- Email verification required for email/password users
- Google login users treated as verified
- Password reset by email
- Self-serve account deletion

### Staff/Admin Login

- Google login allowed for staff/admins
- Email/password allowed
- No automatic admin access from Google/domain
- Existing admin must promote a user to author/admin
- Admin/API actions must enforce role checks

---

## 4. Monetization Direction

V1 should focus on the free/registered experience first, similar to CitizenReady.

### V1

- No payment integration
- No AdSense
- No analytics
- No paid feature enforcement yet unless needed as feature flags

### Later Research Needed

Decide which features become paid after competitor/user research.

Potential future paid features:

- AI tutor
- Advanced analytics/readiness insights
- Extra mock exams
- Unlimited mistake practice
- Extra streak freezes
- Printable/downloadable study packs
- Premium road-test self-assessment tools

---

## 5. Study Experience

### Onboarding

Users choose:

- Current stage: G1, G2, or full G
- Target test date

The app uses this to recommend:

- Daily question goal
- Lessons to complete
- Practice categories
- Next recommended action

Users can change their target test date. The app should automatically recalculate the daily plan.

### Daily Plan

Daily study plans should recommend a mix of:

- Lessons
- Practice questions

Daily question goal should be recommended by drivexam, not manually chosen by default.

### Practice Sessions

Users can choose question count from admin-configurable options such as:

- 10
- 20
- 30

Practice can be filtered by:

- All categories
- Road signs
- Rules of the road
- Safe driving
- Penalties/demerit points
- Sharing the road
- Mistake-only practice
- Weak-area recommendations

Practice sessions can be paused/resumed freely.

Explanations are shown only at the end to avoid distraction.

### Mock Exams

Mock exams should be:

- Timed
- Pausable/resumable
- Limited by admin-configurable pause count
- Timer counts down only while exam is active
- Timer length configurable by admin
- Explanations shown only after completion

G1 mock exams should use separate section scoring, especially:

- Road signs
- Rules of the road

---

## 6. G1 Content

G1 is especially important for road signs.

### G1 Categories

- Road signs
- Rules of the road
- Safe driving
- Penalties/demerit points
- Sharing the road

### Source Direction

Content should be based on:

- Public Ontario Driver’s Handbook / official Ontario materials
- Original practice questions and explanations created from those sources

### Road Sign Images

Need a road-sign asset strategy.

Preferred approach:

- Use official/public references where allowed
- Create original reusable SVG-style sign illustrations where needed
- Avoid copying assets without reuse rights
- Store source/credit metadata for every road-sign asset

---

## 7. G2 and Full G Road-Test Prep

V1 should include useful road-test preparation for both G2 and full G.

### Road-Test Prep Content

- Before-test checklist
- During-test reminders
- Common fail reasons
- Road-test prep guides
- Self-assessment/mock scoring if practical

### Mock Road-Test Scoring Recommendation

Start with structured self-assessment scoring in V1. Later, improve with:

- More detailed instructor-style rubrics
- AI coaching/tutor
- Better personalized recommendations

---

## 8. Question System

### Supported Question Types

- Multiple choice
- True/false
- Multi-select

For multi-select questions, tell users how many answers to choose.

### Question Media

Questions can include:

- One or more images
- Road-sign images
- Answer choices with text and/or images

### Explanation Requirements

Every published question must include an explanation.

Published questions should require:

- Question text
- Correct answer(s)
- Explanation
- Stage/category
- Review status

Explanations should support rich formatting:

- Bullets
- Links
- Bold text
- Images

---

## 9. Lessons and Handbook-Style Content

Lessons should support rich formatting and images.

Lessons should be organized by:

- Stage
- Category

Examples:

- G1 → Road Signs
- G1 → Rules of the Road
- G2 → Lane Changes
- G2 → Parking
- G → Highway Driving

Lessons guide users but do not block quizzes. Quizzes are available anytime.

---

## 10. Progress, Motivation, and Dashboard

### Dashboard

Registered verified users should see:

- Today’s recommended question goal
- Readiness score
- Weak areas
- Recent quiz/mock exam scores
- Next recommended action
- Stage progress
- Streak status
- Achievements/badges

### Readiness Scores

Calculate readiness separately for:

- G1
- G2
- Full G

Admin should be able to configure readiness thresholds/formula settings.

### Stage Progression

Users can manually mark:

- G1 passed
- G2 passed

The app should ask for confirmation and then move them to the next stage while preserving old history.

### Streaks

Streaks are based on completing the recommended daily question goal.

Include a streak-freeze/grace system in V1:

- Limited number of free monthly freezes for registered users
- Monthly allowance configurable by admin
- Streak freezes may become paid later

### Milestones and Achievements

Celebrate:

- Daily goal completed
- Streak milestones
- Readiness improvement
- 80%+ readiness
- Stage marked passed
- First mock exam completed

Achievements/certificates:

- Show in dashboard
- Allow simple native share/download in V1
- Do not create public achievement pages in V1

---

## 11. Admin CMS

V1 requires an admin area.

### Roles

- Regular user
- Author
- Admin

### Workflow

Use draft/review workflow:

- Author creates drafts and submits for review
- Admin approves, publishes, unpublishes, edits all content
- Quiz questions require review before going live

### Admin Can Manage

- Users
- Role promotions
- Questions
- Explanations
- Categories
- Lessons
- Road-sign assets
- Road-test checklist items
- Blog/news posts
- FAQ
- Terms, Privacy Policy, Contact, Disclaimer
- Site settings
- Contact submissions
- Question reports

### Admin-Configurable Settings

- Readiness score thresholds/formula settings
- Daily goal rules
- Mock exam timer length
- Mock exam pause limits
- Practice question count options
- Monthly free streak-freeze allowance
- Branding/site settings

---

## 12. Blog and News

Blog/news should be public and managed through admin.

### Topics

- Ontario driving-test tips
- Road safety articles
- DriveTest / Ontario rule updates
- Beginner driver guides
- Insurance/car ownership tips
- App announcements

### Blog/News Features

- Public articles
- Categories
- Tags
- SEO title
- Meta description
- Slug
- Featured image
- Draft/review workflow

No comments in V1.

No ads in V1. AdSense comes later after content and compliance are ready.

---

## 13. Public Pages

Include:

- Marketing homepage
- Blog/news index and articles
- FAQ
- Terms
- Privacy Policy
- Contact
- Disclaimer

Homepage should explain the G1 → G2 → G journey and position drivexam as a trustworthy learning companion.

Legal/footer pages should be editable from admin for AdSense readiness later.

### Contact Form

- Verified registered users only
- Text-only in V1
- Submissions go to admin dashboard
- No email notification in V1 unless added later

---

## 14. Question Reporting

Question reports should be available to unregistered users too.

Report requires:

- Reason
- Optional comment

Reasons:

- Incorrect answer
- Confusing explanation
- Typo/grammar
- Outdated rule
- Image/sign issue
- Other

Reports go to admin dashboard.

### Anti-Abuse Defaults

- Anonymous users: 5 reports/hour
- Registered users: 20 reports/hour
- Authors/admins: higher or exempt
- Honeypot spam check
- Store IP hash where possible
- Group duplicate reports by question

---

## 15. Branding and Site Settings

Public name is **drivexam** for now.

Admin should manage:

- Site name
- Logo text
- Logo image
- Favicon
- Brand colours
- Homepage text/tagline
- Social links
- Contact email

---

## 16. Uploads and Media

V1 uploads stored locally on server.

Upload use cases:

- Blog/news images
- Logo/favicon
- Road-sign images
- Rich content images

### Road-Sign Asset Library

Road-sign assets should be managed separately and reusable across questions.

Metadata:

- Sign name
- Category
- Description
- Source/credit
- Uploaded image

---

## 17. Platform and Offline Direction

### Platform

- Web app first
- Mobile-friendly
- Installable PWA in V1
- Native mobile app possibly later

### Offline

V1 should include:

- Installable PWA shell
- Fast cached pages

V1 should not include full offline studying/quizzes. Quizzes and progress require online access.

---

## 18. Technical Direction

Approved stack direction:

- Next.js 15 App Router
- Tailwind
- shadcn/ui
- Prisma
- Postgres
- Auth.js/NextAuth
- Google login
- Email/password login
- Gmail/Google Workspace first for email
- Email layer designed to switch to Resend/Postmark later
- PWA support

No Supabase runtime.

### Email

Use Google Workspace/Gmail first for development/early launch, but abstract email sending so it can switch to Resend/Postmark later.

Required emails:

- Email verification
- Password reset

---

## 19. Repo and Deployment

### Local Project

`D:\Factory\drivexam`

### GitHub Repo

`https://github.com/webllrzjohnson/drivexam.git`

### Branch

Use `main` as the default branch.

### Deployment

- No deployment yet
- Push to GitHub only when Louie approves
- Coolify/deployment can be decided later

---

## 20. Build Phases

### Phase 1 — Foundation

- Next.js 15 setup
- Tailwind/shadcn
- Prisma/Postgres
- Auth.js/NextAuth
- Email verification/password reset foundation
- User roles
- Base layout
- PWA basics
- Local upload foundation

### Phase 2 — Admin CMS

- Admin dashboard
- User/role management
- Site settings
- Road-sign asset library
- Categories
- Lessons
- Questions
- Draft/review workflow
- FAQ/legal page management
- Blog/news management
- Contact submissions
- Question reports

### Phase 3 — Study Engine

- Practice sessions
- Question count selection
- Category practice
- Timed mock exams
- Pause/resume
- Mock exam scoring
- End-of-session explanations
- Mistake tracking
- Mistake-only practice

### Phase 4 — User Dashboard

- Daily study plan
- Target test date
- Daily question goal
- Readiness scores
- Weak-area recommendations
- Stage progress
- Streaks/streak freezes
- Achievements/certificates

### Phase 5 — Road-Test Prep

- G2/G checklists
- Before/during/fail-reason sections
- Mock road-test self-assessment/scoring
- Road-test readiness guidance

### Phase 6 — Public Site and Polish

- Trustworthy homepage
- Public limited previews
- Public blog/news
- FAQ/legal/contact pages
- SEO metadata
- Mobile polish
- PWA install polish

### Phase 7 — Later Enhancements

- AI tutor
- Paid upgrades
- AdSense
- Analytics
- Deeper offline support
- Native app exploration

---

## 21. Open Questions for Later

These do not block the product direction yet:

1. Exact paid feature list.
2. Exact readiness score formula.
3. Exact daily goal formula.
4. Exact mock exam format and scoring thresholds.
5. Exact G2/G road-test scoring rubric.
6. Exact source/rights approach for road-sign images.
7. Whether to use a rich text editor library or Markdown/MDX-style editor.
8. Exact email implementation details for Gmail first.
9. Initial content import/seeding strategy.
10. Deployment target and production environment.

---

## 22. Working Preferences

For this project:

- Ask Louie one question at a time.
- Avoid long scrolling question lists.
- Use standard/best-practice defaults unless there is a meaningful tradeoff.
- Explain technical choices before asking for approval when they matter.
- Do not start implementation until Louie approves.
- Push to GitHub only when Louie approves.
- Do not deploy until Louie approves.
