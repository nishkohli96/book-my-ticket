import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import AppBar from '../appbar';

type PageShellProps = {
  children: ReactNode;
  /** Content column width cap in px. */
  maxWidth?: number;
};

/** App bar plus a centered, padded content column - the frame every inner page shares. */
export default function PageShell({ children, maxWidth = 1200 }: PageShellProps) {
  return (
    <>
      <AppBar />
      <Box
        component="main"
        sx={{
          maxWidth,
          mx: 'auto',
          px: { xs: 2, sm: 3, lg: 4 },
          py: { xs: 3, md: 5 },
        }}
      >
        {children}
      </Box>
    </>
  );
}
