import { FloatingLabel } from "flowbite-react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface InputFieldProps {
  label: string;
  type?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
}

const InputField = (props: InputFieldProps) => {
  const { label, type = "text", register, error } = props;
  return (
    <>
      <div>
        <FloatingLabel
          {...register}
          type={type}
          label={label}
          variant="outlined"
          color={error && "error"}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
      </div>
    </>
  );
};

export default InputField;
