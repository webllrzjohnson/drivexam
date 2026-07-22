export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function validatePassword(password: string) {
  if (password.length < 8) return { ok: false, message: "Use at least 8 characters." };
  if (!/[0-9]/.test(password)) return { ok: false, message: "Include at least one number." };
  return { ok: true };
}

export function isValidPasswordReset(password: string, confirmPassword: string) {
  return validatePassword(password).ok && password === confirmPassword;
}
