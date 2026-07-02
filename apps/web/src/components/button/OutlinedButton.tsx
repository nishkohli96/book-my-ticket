'use client';

import Button, { type ButtonProps } from '@mui/material/Button';
import { alpha } from '@mui/material/styles';

type OutlinedButtonProps = ButtonProps & {
	text: string;
};

export default function OutlinedButton({
	text,
	sx: btnSx,
	...btnProps
}: OutlinedButtonProps) {
	return (
		<Button
			variant="outlined"
			sx={[
				theme => ({
					borderWidth: '2px',
					borderColor: `${theme.palette.divider} !important`,
					borderRadius: '14px',
					color: theme.palette.text.primary,
					fontWeight: 600,
					height: 48,
					padding: '0 30px',
					backgroundColor: 'transparent',
					'&:hover': {
						borderColor: theme.palette.text.secondary,
						backgroundColor: alpha(theme.palette.primary.main, 0.04),
					},
					...theme.applyStyles('dark', {
						backgroundColor: alpha(theme.palette.common.white, 0.03),
						'&:hover': {
							borderColor: alpha(theme.palette.common.white, 0.32),
							backgroundColor: alpha(theme.palette.common.white, 0.07),
						},
					}),
				}),
				...(Array.isArray(btnSx) ? btnSx : [btnSx])
			]}
			{...btnProps}
		>
			{text}
		</Button>
	);
}
