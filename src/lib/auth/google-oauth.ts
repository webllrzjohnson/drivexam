type GoogleOAuthEnv = NodeJS.ProcessEnv & Partial<Record<"AUTH_URL" | "NEXTAUTH_URL" | "GOOGLE_CLIENT_ID" | "GOOGLE_CLIENT_SECRET", string>>;

function clean(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function hasGoogleOAuthConfig(env: GoogleOAuthEnv = process.env) {
  return Boolean(clean(env.GOOGLE_CLIENT_ID) && clean(env.GOOGLE_CLIENT_SECRET));
}

export function getGoogleOAuthConfig(env: GoogleOAuthEnv = process.env) {
  const clientId = clean(env.GOOGLE_CLIENT_ID);
  const clientSecret = clean(env.GOOGLE_CLIENT_SECRET);

  if (!clientId || !clientSecret) return null;

  return { clientId, clientSecret };
}

export function getGoogleOAuthCallbackUrl(env: GoogleOAuthEnv = process.env) {
  const appUrl = clean(env.AUTH_URL) ?? clean(env.NEXTAUTH_URL) ?? "http://localhost:3000";
  const baseUrl = appUrl.endsWith("/") ? appUrl.slice(0, -1) : appUrl;

  return `${baseUrl}/api/auth/callback/google`;
}
