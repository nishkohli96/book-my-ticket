import Box from '@mui/material/Box';
import LoginPageMobile from '@/views/mobile/login';
import LoginPageDesktop from '@/views/desktop/login';

export default function LoginPage() {
  return (
    <>
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <LoginPageMobile />
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <LoginPageDesktop />
      </Box>
    </>
  );
}
