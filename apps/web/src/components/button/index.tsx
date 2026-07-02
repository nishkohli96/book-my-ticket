import Button, { type ButtonProps } from '@mui/material/Button';
import type { Theme } from '@mui/material/styles';

type GradientButtonProps = ButtonProps & {
  text: string;
};

export function GradientButton({
  text,
  sx: btnSx,
  ...btnProps
}: GradientButtonProps) {
  return (
    <Button
      variant="contained"
      sx={[
        {
          background: (theme: Theme) => theme.palette.gradients.brandPrimary,
          border: 0,
          color: 'white',
          height: 48,
          padding: '0 30px',
        },
        ...(Array.isArray(btnSx) ? btnSx : [btnSx])
      ]}
      {...btnProps}
    >
      {text}
    </Button>
  );
}
