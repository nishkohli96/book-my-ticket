import { type ReactNode } from 'react';
import type { Metadata } from 'next';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import {
  AppThemeProvider,
  colorSchemeAttribute,
  fontVariables,
  modeStorageKey
} from '@/theme';
import ConnectionStatus from '@/views/common/connection-status';
import './globals.css';

const defaultTitle = 'BookMyTicket';

export const metadata: Metadata = {
  title: {
    template: `%s | ${defaultTitle}`,
    default: defaultTitle,
  },
  description: 'NextJS Template App'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontVariables} antialiased`}
      >
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
          <AppThemeProvider>
            <ConnectionStatus>
              {children}
            </ConnectionStatus>
          </AppThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
