import { type ReactNode } from 'react';
import type { Metadata } from 'next';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { ToastContainer } from 'react-toastify';
import {
  AppThemeProvider,
  colorSchemeAttribute,
  fontVariables,
  modeStorageKey
} from '@/theme';
import { SessionProvider } from '@/components';
import ConnectionStatus from '@/views/common/connection-status';
import './globals.css';

const defaultTitle = 'BookMyTicket';

export const metadata: Metadata = {
  title: {
    template: `%s | ${defaultTitle}`,
    default: defaultTitle,
  },
  description: 'BookMyTicket App'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontVariables} antialiased`}>
        {/*
          Runs as a blocking script BEFORE React hydrates.
          Reads localStorage → applies data-color-scheme on <html>.
          Falls back to system preference if no stored value.
          Must come before the <main> element
        */}
        <InitColorSchemeScript
          attribute={colorSchemeAttribute}
          defaultMode="system"
          modeStorageKey={modeStorageKey}
        />
        <AppRouterCacheProvider options={{ key: 'mui' }}>
          <SessionProvider>
            <AppThemeProvider>
              <ConnectionStatus>
                {children}
                <ToastContainer
                  autoClose={3000}
                  limit={2}
                  stacked
                  closeButton
                  style={{ fontSize: '1rem' }}
                />
              </ConnectionStatus>
            </AppThemeProvider>
          </SessionProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
