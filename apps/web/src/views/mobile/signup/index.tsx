'use client';

import Link from 'next/link';
import { MobileAuthShell } from '@/views/common/auth-shell';
import SignUpForm from '@/views/common/signup';

export default function SignUpPageMobile() {
  return (
    <MobileAuthShell
      title="Create your account"
      subtitle="Book tickets in seconds."
      footer={(
        <>
          Already have an account?
          {' '}
          <Link href="/login">Log in</Link>
        </>
      )}
    >
      <SignUpForm />
    </MobileAuthShell>
  );
}
