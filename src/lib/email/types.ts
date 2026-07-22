export type SendEmailInput = { to: string; subject: string; text: string; html?: string; };
export type SendEmailResult = { id?: string; skipped?: boolean; };
