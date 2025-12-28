import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { query } from "@/lib/db";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const res = await query("SELECT * FROM users WHERE email = $1", [credentials.email]);
                const user = res.rows[0];

                if (user && await bcrypt.compare(credentials.password, user.password_hash)) {
                    return { id: user.id.toString(), email: user.email };
                }

                // For v0.1: Auto-create user if demo email is used? 
                // Or just fail if not exists. Let's keep it simple: fail if not exists.
                return null;
            }
        })
    ],
    pages: {
        signIn: "/auth/signin",
    },
    callbacks: {
        async session({ session, token }: any) {
            if (token && session.user) {
                session.user.id = token.sub;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
