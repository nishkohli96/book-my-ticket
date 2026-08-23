import { redirect } from 'next/navigation';
import type { UserProfileDetails } from '@book-my-ticket/common';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { AppBar } from '@/components';
import { apiServicesUrl } from '@/constants/environment';
import AccountPageDesktop from '@/views/desktop/account';

async function fetchUserProfile(accessToken: string): Promise<UserProfileDetails | null> {
  const response = await fetch(`${apiServicesUrl.user}/profile`, {
    headers: { Authorization: `Bearer ${accessToken}` },
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

  const profile = await fetchUserProfile(session.accessToken);

  return (
    <>
      <AppBar />
      <AccountPageDesktop
        initialProfile={profile}
      />
    </>
  );
}
