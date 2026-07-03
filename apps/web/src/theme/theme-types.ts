import '@mui/material/styles';

type AppGradients = {
  brandPrimary: string;
  brandDark: string;
  hero: string;
  cardConcert: string;
  cardSports: string;
  cardTheater: string;
  cardComedy: string;
  cardSymphony: string;
  cardVenueDark: string;
  venueFallback: string;
  stageBar: string;
  heroScrim: string;
};

declare module '@mui/material/styles' {
  interface Palette {
    gradients: AppGradients;
    primaryTint: string;
    secondaryTint: string;
    warningTint: string;
  }

  interface PaletteOptions {
    gradients?: AppGradients;
    primaryTint?: string;
    secondaryTint?: string;
    warningTint?: string;
  }
}
