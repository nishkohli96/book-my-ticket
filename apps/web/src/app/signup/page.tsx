import Box from '@mui/material/Box';
import SignUpPageMobile from '@/views/mobile/signup';
import SignUpPageDesktop from '@/views/desktop/signup';

export default function SignupPage() {
  return (
    <>
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <SignUpPageMobile />
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <SignUpPageDesktop />
      </Box>
    </>
  );
}
