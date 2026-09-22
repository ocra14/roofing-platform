import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { SystemRole } from "@prisma/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email || "").toLowerCase().trim();
        const password = String(credentials?.password || "");
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            name: true,
            email: true,
            passwordHash: true,
            role: true,
            isActive: true,
          },
        });

        if (!user || !user.isActive) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role as SystemRole;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role as SystemRole;
      }
      return session;
    },
  },
});

// ---------------------------------------------------------------------------
// Role-based authorization helpers
// ---------------------------------------------------------------------------
const ROLE_RANK: Record<SystemRole, number> = {
  SUPER_ADMIN: 100,
  ADMINISTRATOR: 80,
  EDITOR: 40,
  SALES: 30,
  MARKETING: 20,
};

/** Resource-level permission matrix. Keep conservative by default. */
const PERMISSIONS: Record<string, SystemRole[]> = {
  "leads:read": ["SUPER_ADMIN", "ADMINISTRATOR", "SALES"],
  "leads:write": ["SUPER_ADMIN", "ADMINISTRATOR", "SALES"],
  "leads:export": ["SUPER_ADMIN", "ADMINISTRATOR", "SALES"],
  "content:read": ["SUPER_ADMIN", "ADMINISTRATOR", "EDITOR", "MARKETING"],
  "content:write": ["SUPER_ADMIN", "ADMINISTRATOR", "EDITOR"],
  "blog:write": ["SUPER_ADMIN", "ADMINISTRATOR", "EDITOR", "MARKETING"],
  "seo:write": ["SUPER_ADMIN", "ADMINISTRATOR"],
  "settings:write": ["SUPER_ADMIN", "ADMINISTRATOR"],
  "security:write": ["SUPER_ADMIN"],
  "users:write": ["SUPER_ADMIN"],
  "system:admin": ["SUPER_ADMIN"],
};

export function can(role: SystemRole | undefined | null, permission: string): boolean {
  if (!role) return false;
  const allowed = PERMISSIONS[permission];
  if (!allowed) return false;
  if (role === "SUPER_ADMIN") return true;
  return allowed.includes(role);
}

export function roleAtLeast(role: SystemRole | undefined | null, min: SystemRole): boolean {
  if (!role) return false;
  return (ROLE_RANK[role] ?? 0) >= (ROLE_RANK[min] ?? 0);
}
