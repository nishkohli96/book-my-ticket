import type { Metadata } from 'next';
import Link from 'next/link';
import { Stack, Typography } from '@mui/material';
import type { SeatHold } from '@book-my-ticket/common';
import { GradientButton, PageShell, SecondaryText } from '@/components';
import { apiServicesUrl } from '@/constants/environment';
import { callService } from '@/lib/services';
import CheckoutView from '@/views/common/checkout';

export const metadata: Metadata = { title: 'Checkout' };

type CheckoutPageProps = {
  params: Promise<{ holdId: string }>;
};

/* Signed-out visitors never get here - proxy.ts redirects /checkout to /login. */
export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { holdId } = await params;
  const { data: hold, message } = await callService<SeatHold>(
    `${apiServicesUrl.booking}/holds/${encodeURIComponent(holdId)}`,
    { authenticated: true }
  );

  return (
    <PageShell maxWidth={1040}>
      {hold
        ? <CheckoutView hold={hold} />
        : (
          <Stack spacing={2} sx={{ alignItems: 'center', py: 8, textAlign: 'center' }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 800 }}>
              Nothing to check out
            </Typography>
            <SecondaryText>
              {message}
            </SecondaryText>
            <GradientButton href="/events" LinkComponent={Link}>
              Browse events
            </GradientButton>
          </Stack>
        )}
    </PageShell>
  );
}
