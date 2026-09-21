import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js config shared between the full server config
 * (src/lib/auth.ts) and the middleware. Deliberately has no providers —
 * the Credentials provider pulls in bcryptjs and Prisma, which are Node-only
 * and were bloating the middleware's Edge Function bundle past Vercel's 1MB
 * limit. Middleware only needs to read/verify the existing JWT session, not
 * run the sign-in flow, so it never needs those providers.
 */
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [],
};
