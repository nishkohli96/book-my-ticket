'use client';

import { type FieldValues } from 'react-hook-form';
import RHFPhoneInput, { type RHFPhoneInputProps } from '@nish1896/rhf-mui-components/misc/phone-input';
import StyledErrorMsg from '../StyledErrorMsg';

type StyledRHFPhoneInputProps<T extends FieldValues> = Omit<
	RHFPhoneInputProps<T>,
	'variant' | 'showLabelAboveFormField' | 'renderError'
>;

const StyledRHFPhoneInput = <T extends FieldValues>(
	props: StyledRHFPhoneInputProps<T>
) => {
	return (
		<RHFPhoneInput
			{...props}
			renderError={error => (
				<StyledErrorMsg errorMessage={error?.message} />
			)}
			variant="outlined"
			showLabelAboveFormField
			formLabelProps={{
				sx: {
					fontSize: 12,
					fontWeight: 700,
					letterSpacing: 0.5,
					textTransform: 'uppercase',
					color: 'text.secondary',
					mb: 0.75,
				},
			}}
			sx={{
				'& .MuiOutlinedInput-root': {
					borderRadius: '12px',
				},
			}}
		/>
	);
};

export default StyledRHFPhoneInput;
