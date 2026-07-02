import Box from "@mui/material/Box";
import HomePageMobile from "@/views/mobile/home";
import HomePageDesktop from "@/views/desktop/home";

export default function Home() {
  return (
    <>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <HomePageMobile />
      </Box>
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <HomePageDesktop />
      </Box>
    </>
  );
}
