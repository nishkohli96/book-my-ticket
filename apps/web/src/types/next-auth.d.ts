import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    firstName: string;
    lastName: string;
    /**
     * Absent for Credentials sign-in (schema requires phone at signup).
     * Set for Google.
     */
    hasPhoneNumber?: boolean;
  }

  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      hasPhoneNumber: boolean;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    firstName: string;
    lastName: string;
    hasPhoneNumber: boolean;
  }
}
