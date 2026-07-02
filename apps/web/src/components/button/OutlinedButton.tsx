'use client';

import Button, { type ButtonProps } from '@mui/material/Button';

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
				{
					border: theme => `2px solid ${theme.palette.divider}`,
					borderRadius: '14px',
					color: theme => theme.palette.text.primary,
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
