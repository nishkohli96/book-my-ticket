'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  AppBar,
  BackButton,
  GradientButton,
  OutlinedButton
} from '@/components';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <AppBar />
      </Box>
      <Box sx={{ display: { xs: 'block', md: 'none' }, p: 3, pb: 0 }}>
        <BackButton />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          pb: 5
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            flex: 1,
            minHeight: { xs: '65vh', md: '75vh' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}
        >
          <Image
            src="/icons/404.svg"
            alt="404"
            width={240}
            height={150}
            priority
            style={{ width: '100%', maxWidth: 240, height: 'auto' }}
          />
          <Typography
            variant="h4"
            sx={{ mt: { md: 2 }, fontWeight: 800 }}
          >
            This page took an intermission
          </Typography>
          <Typography
            sx={{
              mt: 1.5,
              color: 'text.secondary',
              maxWidth: 420
            }}
          >
            {'We couldn\'t find that event, venue, or page. It may have sold out, ended, or the link\'s just wrong.'}
          </Typography>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1.5}
            sx={{ mt: 4, width: { xs: '100%', md: 'auto' } }}
          >
            <GradientButton
              onClick={() => router.back()}
              sx={{ width: { xs: '100%', md: 'auto' }, whiteSpace: 'nowrap' }}
            >
              Back to browsing
            </GradientButton>
            <OutlinedButton
              onClick={() => router.push('/')}
              sx={{
                width: { xs: '100%', md: 'auto' },
                whiteSpace: 'nowrap',
                display: { xs: 'inline-flex' },
              }}
            >
              Go to homepage
            </OutlinedButton>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
