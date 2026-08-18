'use client';

import Link from 'next/link';
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
          <Link href="/signup">Create an account</Link>
        </>
      )}
    >
      <LoginForm />
    </MobileAuthShell>
  );
}
