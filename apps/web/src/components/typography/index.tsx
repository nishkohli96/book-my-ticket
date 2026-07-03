import Typography, { type TypographyProps } from '@mui/material/Typography';

type AppTypographyProps = Omit<TypographyProps, 'variant'>;

export function PrimaryText({
  children,
  sx,
  ...props
}: AppTypographyProps) {
  return (
    <Typography
      {...props}
      variant="body2"
      sx={{
        ...sx,
        color: 'var(--mui-palette-text-primary)'
      }}
    >
      {children}
    </Typography>
  );
}

export function SecondaryText({
  children,
  sx,
  ...props
}: AppTypographyProps) {
  return (
    <Typography
      {...props}
      variant="body2"
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

export function DisabledText({
  children,
  sx,
  ...props
}: AppTypographyProps) {
  return (
    <Typography
      {...props}
      variant="body2"
      sx={{
        ...sx,
        color: 'var(--mui-palette-text-disabled)'
      }}
    >
      {children}
    </Typography>
  );
}
