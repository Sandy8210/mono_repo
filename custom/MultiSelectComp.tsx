import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { SelectOption } from "./SelectComp";
import { cn } from "@company/ui/lib/utils";
import { Field, FieldLabel } from "../ui/field";

export interface MultiSelectCompProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  options: SelectOption[] | string[];
  value?: string[];
  onChange?: (value: string[]) => void;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
  disabled?: boolean;
  className?: string;
}

export const MultiSelectComp = React.forwardRef
  <HTMLDivElement,
    MultiSelectCompProps
  >(
    (
      {
        label,
        error,
        required = false,
        placeholder = "Select options...",
        options = [],
        className,
        value = [],
        onChange,
        onBlur,
        disabled,
      },
      ref,
    ) => {
      const [open, setOpen] = React.useState(false);

      const normalizedOptions = options.map((opt) =>
        typeof opt === "string" ? { label: opt, value: opt } : opt,
      );

      const handleSelect = (currentValue: string) => {
        const isSelected = value.includes(currentValue);
        const newValue = isSelected
          ? value.filter((v) => v !== currentValue)
          : [...value, currentValue];
        onChange?.(newValue);
      };

      const handleRemoveTag = (e: React.MouseEvent, optionToRemove: string) => {
        e.stopPropagation();
        onChange?.(value.filter((v) => v !== optionToRemove));
      };

      const handleClearAll = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange?.([]);
      };

      return (
        <Field>
          <FieldLabel htmlFor={`input-${label}`}>
            {label} {required && <span className="text-red-500">*</span>}
          </FieldLabel>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div
                ref={ref}
                role="combobox"
                aria-expanded={open}
                aria-disabled={disabled}
                tabIndex={disabled ? -1 : 0}
                onBlur={onBlur}
                onClick={() => {
                  if (!disabled) setOpen((prev) => !prev);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (!disabled) setOpen((prev) => !prev);
                  }
                }}
                className={cn(
                  "flex min-h-10 w-full cursor-pointer items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  disabled && "cursor-not-allowed opacity-50",
                  error && "border-red-500  focus:ring-red-500",
                  !value.length && "text-muted-foreground",
                )}
              >
                <div className="flex flex-wrap gap-1 flex-1 min-w-0">
                  {value.length > 0 ? (
                    value.map((val) => {
                      const option = normalizedOptions.find((o) => o.value === val);
                      return (
                        <span
                          key={val}
                          className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded-md text-xs font-medium"
                        >
                          {option?.label || val}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-red-500 shrink-0"
                            onClick={(e) => handleRemoveTag(e, val)}
                          />
                        </span>
                      );
                    })
                  ) : (
                    <span>{placeholder}</span>
                  )}
                </div>

                {/* Right icon */}
                <div className="ml-2 shrink-0">
                  {value.length > 0 && !disabled ? (
                    // Clear-all X
                    <X
                      className="h-4 w-4 opacity-50 hover:opacity-100 cursor-pointer text-foreground"
                      onClick={handleClearAll}
                    />
                  ) : (
                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                  )}
                </div>
              </div>
            </PopoverTrigger>

            <PopoverContent
              className="w-full p-0 border-0 z-[99999] bg-background"
              align="start"
              style={{ width: "var(--radix-popover-trigger-width)" }}
            >
              <Command className="w-full border shadow-md bg-background">
                <CommandInput placeholder="Search options..." autoFocus />
                <CommandList>
                  <CommandEmpty>No options found.</CommandEmpty>
                  <CommandGroup>
                    {normalizedOptions.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        onSelect={() => handleSelect(option.value)}
                        className="cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value.includes(option.value) ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {error && <span className="text-sm text-red-500">{error}</span>}
        </Field>
      );
    },
  );

MultiSelectComp.displayName = "MultiSelectComp";