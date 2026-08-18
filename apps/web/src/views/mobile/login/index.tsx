'use client';

import { AppLink } from '@/components';
import { MobileAuthShell } from '@/views/common/auth-shell';
import LoginForm from '@/views/common/login';

export default function LoginPageMobile() {
  return (
    <MobileAuthShell
      title="Welcome back"
      subtitle="Log in to manage your bookings."
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
