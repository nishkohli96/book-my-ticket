'use client';

import { AppLink } from '@/components';
import { MobileAuthShell } from '@/views/common/auth-shell';
import SignUpForm from '@/views/common/signup';

export default function SignUpPageMobile() {
  return (
    <MobileAuthShell
      footer={(
        <>
          Already have an account?
          {' '}
          <AppLink href="/login">Log in</AppLink>
        </>
      )}
    >
      <SignUpForm />
    </MobileAuthShell>
  );
}
