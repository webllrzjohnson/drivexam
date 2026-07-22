export type AdminModule = {
  slug: string;
  title: string;
  description: string;
  phase: string;
};

export const adminModules: AdminModule[] = [
  {
    slug: "users",
    title: "Users",
    description: "Manage registered users and promote trusted accounts to author or admin.",
    phase: "Phase 2",
  },
  {
    slug: "settings",
    title: "Site Settings",
    description: "Manage site name, branding, favicon, homepage copy, social links, and contact email.",
    phase: "Phase 2",
  },
  {
    slug: "assets",
    title: "Road Sign Assets",
    description: "Upload reusable road-sign, logo, favicon, blog, and rich-content images with source credit.",
    phase: "Phase 2",
  },
  {
    slug: "categories",
    title: "Categories",
    description: "Organize G1, G2, and G lessons/questions by road signs, rules, safe driving, and more.",
    phase: "Phase 2",
  },
  {
    slug: "questions",
    title: "Questions",
    description: "Create handbook-based questions, answers, explanations, review states, and image attachments.",
    phase: "Phase 2",
  },
  {
    slug: "lessons",
    title: "Lessons",
    description: "Author rich handbook-style lessons by stage and category.",
    phase: "Phase 2",
  },
  {
    slug: "road-test",
    title: "Road-Test Prep",
    description: "Manage before-test, during-test, common fail reason, and self-assessment checklist items.",
    phase: "Phase 2",
  },
  {
    slug: "blog",
    title: "Blog & News",
    description: "Publish Ontario driving tips, news, guides, insurance/car ownership content, and announcements.",
    phase: "Phase 2",
  },
  {
    slug: "pages",
    title: "Legal Pages",
    description: "Edit Terms, Privacy, Contact, and Disclaimer page content for trust and AdSense readiness.",
    phase: "Phase 2",
  },
  {
    slug: "faq",
    title: "FAQ",
    description: "Manage public Ontario licence and drivexam FAQ entries.",
    phase: "Phase 2",
  },
  {
    slug: "reports",
    title: "Question Reports",
    description: "Review user reports for incorrect answers, confusing explanations, typos, outdated rules, or image issues.",
    phase: "Phase 2",
  },
  {
    slug: "contact",
    title: "Contact Submissions",
    description: "Review text-only support messages from verified registered users.",
    phase: "Phase 2",
  },
];

export function getAdminModule(slug: string) {
  return adminModules.find((module) => module.slug === slug);
}
