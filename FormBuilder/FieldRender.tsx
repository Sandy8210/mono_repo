import { CheckBoxComp, DateInputComp, FileInputComp, InputOTPComp, MaskedInputComp, MultiSelectComp, NumberInputComp, PanInputComp, PasswordComp, RadioComp, SelectComp, TextInputComp } from "@company/ui";
import { getInputFilter } from "./validation/ValidateInput";
import { Controller } from "react-hook-form";

const FieldRender = ({
  field,
  errors,
  register,
  control,
}: {
  field: any;
  errors: any;
  register: any;
  control: any;
}) => {
  if (!field) return null;

  const fieldError = errors[field.name]?.message;
  const filter = getInputFilter(field?.type);

  switch (field.interface) {
    case "input":
    case "text":
      return (
        <TextInputComp
          label={field?.label}
          description={field?.description}
          type={field?.type}
          placeholder={field?.placeholder}
          required={field?.required}
          icon={field?.icon}
          prefix={field?.prefix}
          postfix={field?.postfix}
          error={fieldError}
          maxLength={field?.maxLength}
          minLength={field?.minLength}
          {...register(field.name, {
            onChange: (e: any) => {
              if (filter) {
                e.target.value = filter(e.target.value);
              }
            },
          })}
        />
      );

    case "password":
      return (
        <PasswordComp
          label={field?.label}
          description={field?.description}
          type={field?.type}
          placeholder={field?.placeholder}
          required={field?.required}
          icon={field?.icon}
          prefix={field?.prefix}
          postfix={field?.postfix}
          error={fieldError}
          maxLength={field?.maxLength}
          minLength={field?.minLength}
          {...register(field.name, {
            onChange: (e: any) => {
              if (filter) {
                e.target.value = filter(e.target.value);
              }
            },
          })}
        />
      );


    case "numeric":
      return (
        <NumberInputComp
          label={field?.label}
          description={field?.description}
          type={field?.type}
          placeholder={field?.placeholder}
          required={field?.required}
          icon={field?.icon}
          prefix={field?.prefix}
          postfix={field?.postfix}
          maxLength={field?.maxLength}
          minLength={field?.minLength}
          error={fieldError}
          {...register(field.name, {
            onChange: (e: any) => {
              if (filter) {
                e.target.value = filter(e.target.value);
              }
            },
          })}
        />
      );

    case 'masked-input':
      return (
        <MaskedInputComp
          label={field?.label}
          description={field?.description}
          type={field?.type}
          placeholder={field?.placeholder}
          required={field?.required}
          icon={field?.icon}
          prefix={field?.prefix}
          postfix={field?.postfix}
          error={fieldError}
          maxLength={field?.maxLength}
          minLength={field?.minLength}
          mask={field.mask}
          space={field?.space}
          maskedValue={field?.maskedValue}
          {...register(field.name)}
        />
      );

    case "input-otp":
      return (
        <Controller
          name={field.name}
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <InputOTPComp
              label={field?.label}
              description={field?.description}
              type={field?.type}
              placeholder={field?.placeholder}
              required={field?.required}
              icon={field?.icon}
              prefix={field?.prefix}
              postfix={field?.postfix}
              digit={field?.digit}
              separatorGap={field?.separatorGap}
              error={fieldError}
              maxLength={field?.maxLength}
              minLength={field?.minLength}
              value={value}
              ref={ref}
              onBlur={onBlur}
              onChange={(val: string) => {
                let finalValue = val;
                if (filter) {
                  finalValue = filter(finalValue);
                }
                onChange(finalValue);
              }}
            />
          )}
        />
      );

    case "pan-input":
      return (
        <PanInputComp
          label={field?.label}
          description={field?.description}
          type={field?.type}
          placeholder={field?.placeholder}
          required={field?.required}
          icon={field?.icon}
          prefix={field?.prefix}
          postfix={field?.postfix}
          error={fieldError}
          maxLength={field?.maxLength}
          minLength={field?.minLength}
          {...register(field.name, {
            onChange: (e: any) => {
              if (filter) {
                e.target.value = filter(e.target.value);
              }
            },
          })}
        />
      );

    case "select":
      return (
        <Controller
          name={field.name}
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <SelectComp
              label={field?.label}
              description={field?.description}
              placeholder={field?.placeholder}
              required={field?.required}
              error={fieldError}
              options={field?.options || []}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              ref={ref}
            />
          )}
        />
      )

    case "multi-select":
      return (
        <Controller
          name={field.name}
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <MultiSelectComp
              label={field?.label}
              description={field?.description}
              placeholder={field?.placeholder}
              required={field?.required}
              error={fieldError}
              options={field?.options || []}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              ref={ref}
            />
          )}
        />
      )

    case "date":
      return (
        <DateInputComp
          label={field?.label}
          type={field?.type}
          description={field?.description}
          placeholder={field?.placeholder}
          required={field?.required}
          leftSideIcon={field?.icon}
          prefix={field?.prefix}
          format={field?.format}
          minDate={field?.minDate}
          maxDate={field?.maxDate}
          error={fieldError}
          {...register(field.name, {
            onChange: (e: any) => {
              if (filter) {
                e.target.value = filter(e.target.value);
              }
            },
          })}
        />
      );

    case "file":
      return (
        <Controller
          name={field.name}
          control={control}
          render={({ field: { onChange, value, ref } }) => (
            <FileInputComp
              label={field.label}
              description={field?.description}
              placeholder={field?.placeholder}
              required={field?.required}
              error={fieldError}
              maxFiles={field.maxFiles}
              themeColor={field.themeColor}
              accept={field.accept}
              value={value}
              onChange={onChange}
              ref={ref}
            />
          )}
        />
      );

    case "checkbox":
      return (
        <Controller
          name={field.name}
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <CheckBoxComp
              label={field?.label}
              description={field?.description}
              required={field?.required}
              error={fieldError}
              name={field.name}
              value={value} // true or false
              onChange={onChange}
              onBlur={onBlur}
              ref={ref}
            />
          )}
        />
      );

    case "radio":
      return (
        <Controller
          name={field.name}
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <RadioComp
              label={field?.label}
              description={field?.description}
              required={field?.required}
              error={fieldError}
              name={field.name}
              options={field?.options || []}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              ref={ref}
            />
          )}
        />
      );

    default:
      return (
        <TextInputComp
          label={field?.label}
          description={field?.description}
          type={field?.type}
          placeholder={field?.placeholder}
          required={field?.required}
          icon={field?.icon}
          prefix={field?.prefix}
          postfix={field?.postfix}
          error={fieldError}
          maxLength={field?.maxLength}
          minLength={field?.minLength}
          {...register(field.name, {
            onChange: (e: any) => {
              if (filter) {
                e.target.value = filter(e.target.value);
              }
            },
          })}
        />
      );

  }
};

export default FieldRender;
