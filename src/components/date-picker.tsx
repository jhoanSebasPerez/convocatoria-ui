import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Button from '@mui/material/Button';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { UseDateFieldProps } from '@mui/x-date-pickers/DateField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
    BaseSingleInputFieldProps,
    DateValidationError,
    FieldSection,
} from '@mui/x-date-pickers/models';

interface ButtonFieldProps
    extends UseDateFieldProps<Dayjs, false>,
    BaseSingleInputFieldProps<
        Dayjs | null,
        Dayjs,
        FieldSection,
        false,
        DateValidationError
    > {
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

function ButtonField(props: ButtonFieldProps) {
    const {
        setOpen,
        label,
        id,
        disabled,
        InputProps: { ref } = {},
        inputProps: { 'aria-label': ariaLabel } = {},
    } = props;

    return (
        <Button
            variant="outlined"
            id={id}
            disabled={disabled}
            ref={ref}
            aria-label={ariaLabel}
            size="small"
            onClick={() => setOpen?.((prev) => !prev)}
            startIcon={<CalendarTodayRoundedIcon fontSize="small" />}
            sx={{ minWidth: 'fit-content' }}
        >
            {label ? `${label}` : 'Pick a date'}
        </Button>
    );
}

interface CustomDatePickerProps {
    readonly value: Dayjs | null;
    readonly onChange: (newValue: Dayjs | null) => void;
}

export default function CustomDatePicker(
    {
        value,
        onChange,
    }: CustomDatePickerProps
) {

    const [open, setOpen] = React.useState(false);
    const buttonRef = React.useRef<HTMLButtonElement | null>(null);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                value={value}
                label={value == null ? null : value.format('MMM DD, YYYY')}
                onChange={(newValue) => {
                    if (newValue) {
                        onChange(newValue);

                        // 🔹 **Forzar transferencia de foco antes de cerrar**
                        setTimeout(() => {
                            buttonRef.current?.focus(); // Enfocar el botón para evitar aria-hidden error
                            setOpen(false);
                        }, 100);
                    }
                }}
                slots={{ field: ButtonField }}
                slotProps={{
                    field: { setOpen, ref: buttonRef } as any,
                    nextIconButton: { size: 'small' },
                    previousIconButton: { size: 'small' },
                }}
                open={open}
                onClose={() => {
                    setTimeout(() => {
                        buttonRef.current?.focus(); // Mover el foco al botón antes de cerrar
                        setOpen(false);
                    }, 100);
                }}
                onOpen={() => setOpen(true)}
                views={['day', 'month', 'year']}
            />
        </LocalizationProvider>
    );
}
