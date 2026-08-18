'use client';

import Link from 'next/link';
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
          <Link href="/signup">Create an account</Link>
        </>
      )}
    >
      <LoginForm />
    </DesktopAuthShell>
  );
}
