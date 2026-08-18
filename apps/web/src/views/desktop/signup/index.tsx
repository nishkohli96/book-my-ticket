'use client';

import Link from 'next/link';
import { DesktopAuthShell } from '@/views/common/auth-shell';
import SignUpForm from '@/views/common/signup';

export default function SignUpPageDesktop() {
  return (
    <DesktopAuthShell
      title="Find your seat. Book it before it's gone."
      subtitle="Create an account to hold seats on a live map and check out in seconds."
      footer={(
        <>
          Already have an account?
          {' '}
          <Link href="/login">Log in</Link>
        </>
      )}
    >
      <SignUpForm />
    </DesktopAuthShell>
  );
}
