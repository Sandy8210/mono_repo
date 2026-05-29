import { Field, validation } from "./ValidateInput";

export const validationResolver = (fields: Field[]) => {
  return async (values: any) => {
    let errors: Record<string, any> = {};

    validation(values, fields, (newErrors) => {
      for (const key in newErrors) {
        if (newErrors.hasOwnProperty(key)) {
          errors[key] = { message: newErrors[key] };
        }
      }
    });

    return {
      values: Object.keys(errors).length === 0 ? values : {},
      errors,
    };
  };
};
