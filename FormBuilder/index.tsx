import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@company/ui";
import FieldRender from "./FieldRender";
import { validationResolver } from "./validation/validationResolver";

export const DynamicFormBuilder = ({
  schema,
  onSubmit,
}: {
  schema: any[];
  onSubmit: (data: any) => void;
}) => {

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: validationResolver(schema),
    mode: "onSubmit",
  });

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 w-full border rounded-md bg-white text-black mt-4"
    >
      <div className="grid grid-cols-4 gap-x-6 gap-y-4 w-full">
        {schema.map((field) => (
          <div key={field.name} className="flex flex-col min-w-0">
            <FieldRender
              field={field}
              register={register}
              errors={errors}
              control={control}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-center w-full mt-6">
        <Button type="submit" className="w-fit">
          Submit Form
        </Button>
      </div>
    </form>
  );
};