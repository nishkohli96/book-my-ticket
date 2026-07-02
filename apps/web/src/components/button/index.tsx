import Button, { ButtonProps } from '@mui/material/Button';

type GradientButtonProps = ButtonProps & {
	text: string;
}

export function GradientButton({ text, ...btnProps }: GradientButtonProps) {
	return (
		<Button
			variant="contained"
			sx={{
				background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
				border: 0,
				color: 'white',
				height: 48,
				padding: '0 30px',
			}}
			{...btnProps}
		>
			{text}
		</Button>
	);
}
