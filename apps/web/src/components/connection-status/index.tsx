'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';

type ConnectionStatusProps = {
  children: ReactNode;
};

export default function ConnectionStatus({ children }: ConnectionStatusProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [showReconnectToast, setShowReconnectToast] = useState(false);
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
      {isOnline ? (
        children
      ) : (
        <Box
          component="main"
          sx={(theme) => ({
            minHeight: '100dvh',
            display: 'grid',
            placeItems: 'center',
            px: { xs: 3, md: 4 },
            py: 6,
            color: 'text.primary',
            background:
              theme.palette.mode === 'dark'
                ? 'radial-gradient(circle at 50% 0%, rgba(96, 165, 250, 0.18), transparent 34%), #0B1120'
                : 'radial-gradient(circle at 50% 0%, rgba(29, 78, 216, 0.12), transparent 34%), #F8FAFC',
          })}
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
              sx={(theme) => ({
                width: { xs: 88, md: 104 },
                height: { xs: 88, md: 104 },
                mb: 3,
                borderRadius: 5,
                display: 'grid',
                placeItems: 'center',
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(255, 255, 255, 0.78)',
                border: `1px solid ${theme.palette.divider}`,
                boxShadow:
                  theme.palette.mode === 'dark'
                    ? '0 20px 56px rgba(0, 0, 0, 0.34)'
                    : '0 20px 56px rgba(15, 23, 42, 0.12)',
                backdropFilter: 'blur(16px)',
              })}
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

            <Button
              variant="contained"
              onClick={handleRetry}
              sx={(theme) => ({
                minWidth: 132,
                height: 46,
                px: 3,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 800,
                background: theme.palette.gradients.brandPrimary,
              })}
            >
              Retry
            </Button>
          </Box>
        </Box>
      )}

      <Snackbar
        open={showReconnectToast}
        autoHideDuration={3200}
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
