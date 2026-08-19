'use client';

import { AppLink } from '@/components';
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
          <AppLink href="/login">Log in</AppLink>
        </>
      )}
    >
      <SignUpForm />
    </DesktopAuthShell>
  );
}
