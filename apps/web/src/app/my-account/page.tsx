import { redirect } from 'next/navigation';
import type { UserProfileDetails } from '@book-my-ticket/common';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { AppBar } from '@/components';
import { apiServicesUrl } from '@/constants/environment';
import AccountPageDesktop from '@/views/desktop/account';

async function fetchUserProfile(userId: string): Promise<UserProfileDetails | null> {
  const response = await fetch(`${apiServicesUrl.user}/profile`, {
    headers: { 'x-user-id': userId },
    cache: 'no-store',
  });
  if (!response.ok) {
    return null;
  }
  const result = await response.json();
  return result.data;
}

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  const profile = await fetchUserProfile(session.user.id);

  return (
    <>
      <AppBar />
      <AccountPageDesktop
        initialProfile={profile}
      />
    </>
  );
}
