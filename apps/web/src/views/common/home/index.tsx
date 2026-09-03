import Box from '@mui/material/Box';
import { AppBar } from '@/components';
import { Content, Features } from './components';

export default function HomePageDesktop() {
  return (
    <>
      <AppBar />
      <Box
        sx={{
          px: { xs: 4, lg: 6 },
          pt: { xs: 4, lg: 6 },
          pb: { xs: 6, lg: 8 },
        }}
      >
        <Content />
        <Features />
      </Box>
    </>
  );
}
