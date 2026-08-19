'use client';

import { AppLink } from '@/components';
import { MobileAuthShell } from '@/views/common/auth-shell';
import LoginForm from '@/views/common/login';

export default function LoginPageMobile() {
  return (
    <MobileAuthShell
      footer={(
        <>
          New to BookMyTicket?
          {' '}
          <AppLink href="/signup">Create an account</AppLink>
        </>
      )}
    >
      <LoginForm />
    </MobileAuthShell>
  );
}
