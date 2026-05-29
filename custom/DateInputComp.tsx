"use client"

import * as React from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import DynamicIcon from "../shared/DynamicIcon";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../ui/popover";

dayjs.extend(customParseFormat);

export const DateInputComp = React.forwardRef<
    HTMLInputElement,
    {
        label: string;
        description?: string;
        placeholder?: string;
        required?: boolean;
        leftSideIcon?: string;
        prefix?: string;
        error?: string;
        name?: string;
        format?: string;
        minDate?: Date | string;
        maxDate?: Date | string;
        onChange?: React.ChangeEventHandler<HTMLInputElement>;
        onBlur?: React.FocusEventHandler<HTMLInputElement>;
    }
>(
    (
        {
            label,
            description,
            placeholder,
            required,
            leftSideIcon,
            prefix,
            error,
            onChange,
            onBlur,
            name,
            format = "YYYY-MM-DD", 
            minDate,
            maxDate,
            ...rest 
        },
        ref
    ) => {
        const [open, setOpen] = React.useState(false);
        const [date, setDate] = React.useState<Date | undefined>(undefined);
        const [month, setMonth] = React.useState<Date | undefined>(undefined);

        const parsedMinDate = minDate ? dayjs(minDate).toDate() : undefined;
        const parsedMaxDate = maxDate ? dayjs(maxDate).toDate() : undefined;

        const currentYear = new Date().getFullYear();
        const fromYear = parsedMinDate ? parsedMinDate.getFullYear() : currentYear - 100;
        const toYear = parsedMaxDate ? parsedMaxDate.getFullYear() : currentYear + 50;

        const startMonth = new Date(fromYear, 0, 1);
        const endMonth = new Date(toYear, 11, 31);

        const displayValue = date ? dayjs(date).format(format) : "";

        return (
            <Field>
                <FieldLabel htmlFor={`input-${name}`}>
                    {label} {required && <span className="text-red-500">*</span>}
                </FieldLabel>

                <Popover open={open} onOpenChange={setOpen} modal={false}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            id={`date-picker-${name}`}
                            className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"} ${error ? "border-red-500" : ""}`}
                            onBlur={(e) => {
                                if (onBlur) {
                                    onBlur(e as unknown as React.FocusEvent<HTMLInputElement>);
                                }
                            }}
                        >
                            {leftSideIcon && <DynamicIcon name={leftSideIcon} className="mr-2 h-4 w-4" />}
                            {!leftSideIcon && <DynamicIcon name="Calendar" className="mr-2 h-4 w-4 opacity-50" />}
                            {date ? displayValue : placeholder || `Select ${label}`}
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                        onFocusOutside={(e) => e.preventDefault()}
                        onInteractOutside={(e) => {
                            const target = e.target as HTMLElement;
                            if (target && target.closest("select")) {
                                e.preventDefault();
                            }
                        }}
                    >
                        <Calendar
                            mode="single"
                            selected={date}
                            month={month || date}
                            onMonthChange={setMonth}
                            captionLayout="dropdown"
                            startMonth={startMonth}
                            endMonth={endMonth}
                            disabled={(calendarDate) => {
                                let isDisabled = false;
                                calendarDate.setHours(0, 0, 0, 0);
                                if (parsedMinDate && calendarDate < dayjs(parsedMinDate).startOf("day").toDate()) isDisabled = true;
                                if (parsedMaxDate && calendarDate > dayjs(parsedMaxDate).endOf("day").toDate()) isDisabled = true;
                                return isDisabled;
                            }}
                            onSelect={(newDate) => {
                                if (!newDate) return;

                                setDate(newDate);
                                setMonth(newDate);
                                setOpen(false);

                                if (onChange) {
                                    const formattedString = dayjs(newDate).format(format);
                                    onChange({
                                        target: { name, value: formattedString },
                                        type: "change",
                                    } as unknown as React.ChangeEvent<HTMLInputElement>);
                                }
                            }}
                        />
                    </PopoverContent>
                </Popover>

                {description && <FieldDescription>{description}</FieldDescription>}
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </Field>
        );
    }
);

DateInputComp.displayName = "DateInputComp";