'use client';

import { AppLink } from '@/components';
import { DesktopAuthShell } from '@/views/common/auth-shell';
import LoginForm from '@/views/common/login';

export default function LoginPageDesktop() {
  return (
    <DesktopAuthShell
      title="Welcome back"
      subtitle="Log in to manage your bookings and grab tickets before they're gone."
      footer={(
        <>
          New to BookMyTicket?
          {' '}
          <AppLink href="/signup">Create an account</AppLink>
        </>
      )}
    >
      <LoginForm />
    </DesktopAuthShell>
  );
}
