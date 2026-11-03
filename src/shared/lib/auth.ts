import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { prisma } from '@/shared/lib/prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      phoneE164: { type: 'string', required: false },
      phoneVerifiedAt: { type: 'date', required: false, input: false },
      role: { type: 'string', required: false, defaultValue: 'USER', input: false },
      status: { type: 'string', required: false, defaultValue: 'ACTIVE', input: false },
    },
  },
  trustedOrigins: [
    process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ],
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
