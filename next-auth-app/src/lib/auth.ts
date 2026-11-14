import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { findUser, failLogin, resetLogin } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! }),
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET ? [GitHubProvider({ clientId: process.env.GITHUB_ID, clientSecret: process.env.GITHUB_SECRET })] : []),
    CredentialsProvider({ name: "Credenciales", credentials: { email: { label: "Correo", type: "email" }, password: { label: "Contraseña", type: "password" } },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        if (!email || !credentials?.password || credentials.password.length > 72) return null;
        const user = await findUser(email);
        if (!user || user.locked_until > Date.now()) { await bcrypt.compare(credentials.password, "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6Ttx4w7JqTnI/CqNDEb4Fflg/zElW"); return null; }
        if (!(await bcrypt.compare(credentials.password, user.password))) {
          await failLogin(user.id);
          return null;
        }
        await resetLogin(user.id);
        return { id: String(user.id), name: user.name, email: user.email };
      } }),
  ],
  session: { strategy: "jwt" }, pages: { signIn: "/signIn" },
};
