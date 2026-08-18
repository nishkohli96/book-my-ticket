'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import { GradientButton } from '@/components';

type ConnectionStatusProps = {
  children: ReactNode;
};

export default function ConnectionStatus({ children }: ConnectionStatusProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [showReconnectToast, setShowReconnectToast] = useState(false);
  /**
   * wasOfflineRef ref is specifically for the reconnect toast behavior.
   * If you show a success toast whenever isOnline === true, it can fire
   * on first page load too, which is not what we want.
   */
  const wasOfflineRef = useRef(false);

  useEffect(() => {
    const updateConnectionStatus = () => {
      const nextIsOnline = navigator.onLine;
      setIsOnline(nextIsOnline);
      if (!nextIsOnline) {
        wasOfflineRef.current = true;
        return;
      }
      if (wasOfflineRef.current) {
        setShowReconnectToast(true);
        wasOfflineRef.current = false;
      }
    };

    updateConnectionStatus();
    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);

    return () => {
      window.removeEventListener('online', updateConnectionStatus);
      window.removeEventListener('offline', updateConnectionStatus);
    };
  }, []);

  const handleRetry = () => {
    setIsOnline(navigator.onLine);
  };

  return (
    <>
      {isOnline
        ? (
          children
        )
        : (
          <Box
            component="main"
            sx={{
              minHeight: '100dvh',
              display: 'grid',
              placeItems: 'center',
              px: { xs: 3, md: 4 },
              py: 6,
              color: 'text.primary',
              background: 'var(--mui-palette-background-default)'
            }}
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: 420,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  width: { xs: 88, md: 104 },
                  height: { xs: 88, md: 104 },
                  mb: 3,
                  borderRadius: 5,
                  display: 'grid',
                  placeItems: 'center',
                  backgroundColor: 'var(--mui-palette-background-paper)',
                  border: '1px solid var(--mui-palette-divider)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                <Image
                  src="/icons/connection-lost.svg"
                  alt=""
                  aria-hidden
                  width={56}
                  height={56}
                  priority
                />
              </Box>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  mb: 1.5,
                  fontWeight: 800,
                  fontSize: { xs: 32, md: 44 },
                  lineHeight: 1.08,
                }}
              >
                Connection lost
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  maxWidth: 360,
                  mb: 3,
                  color: 'text.secondary',
                  fontWeight: 600,
                  lineHeight: 1.7,
                }}
              >
                Check your internet connection. We will bring BookMyTicket back
                as soon as you are online.
              </Typography>
              <GradientButton sx={{ minWidth: 140, borderRadius: 2 }} onClick={handleRetry}>
                Retry
              </GradientButton>
            </Box>
          </Box>
        )}
      <Snackbar
        open={showReconnectToast}
        autoHideDuration={3200}
        sx={{ minWidth: 280 }}
        onClose={() => setShowReconnectToast(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setShowReconnectToast(false)}
          sx={{ width: '100%', fontWeight: 700 }}
        >
          You are back online.
        </Alert>
      </Snackbar>
    </>
  );
}
