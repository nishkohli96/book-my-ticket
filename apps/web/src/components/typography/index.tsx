import Typography, { type TypographyProps } from '@mui/material/Typography';

type AppTypographyProps = Omit<TypographyProps, 'variant'>;

export function Body1({
  children,
  sx,
  ...props
}: AppTypographyProps) {
  return (
    <Typography
      {...props}
      variant="body1"
      sx={{
        ...sx,
        lineHeight: 1.65,
        color: 'var(--mui-palette-text-secondary)'
      }}
    >
      {children}
    </Typography>
  );
}
