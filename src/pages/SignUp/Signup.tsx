import { Button, Card, Checkbox, Label } from "flowbite-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { joiResolver } from "@hookform/resolvers/joi";
import axios from "axios";

import { signupSchema } from "../../validations/userValidations/signup.joi";
import type { TUser } from "../../types/TUser";
import Swal from "sweetalert2";
import InputField from "../../components/common/InputField";

// קומפוננטה להרשמת משתמש חדש
const Signup = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<TUser>({
    defaultValues: {
      name: {
        first: "",
        middle: "",
        last: "",
      },
      phone: "",
      email: "",
      password: "",
      image: {
        url: "",
        alt: "",
      },
      address: {
        state: "",
        country: "",
        city: "",
        street: "",
        houseNumber: 1,
        zip: 0,
      },
      isBusiness: false,
    },
    mode: "onChange",
    resolver: joiResolver(signupSchema),
  });

  // שליחת טופס הרשמה
  const submitForm = async (data: TUser) => {
    try {
      const response = await axios.post(
        "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users",
        data,
      );
      localStorage.setItem("token", response.data.token);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your account has been created successfully",
        showConfirmButton: false,
        timer: 2000,
      });
      navigate("/login");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: "Something went wrong. Please try again later.",
      });
    }
  };
  return (
    <>
      <main>
        <div className="flex min-h-screen items-center justify-center dark:bg-gray-900">
          <Card className="w-full max-w-xl text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              SignUp
            </h1>
            {/* טופס הרשמה */}
            <form
              onSubmit={handleSubmit(submitForm)}
              className="flex flex-col gap-4"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* שדות שם פרטי, שני, משפחה */}
                <InputField
                  label="First Name *"
                  register={register("name.first")}
                  error={errors.name?.first}
                />
                <InputField
                  label="Middle Name"
                  register={register("name.middle")}
                  error={errors.name?.middle}
                />
                <InputField
                  label="Last Name *"
                  register={register("name.last")}
                  error={errors.name?.last}
                />
                <InputField
                  label="Phone *"
                  register={register("phone")}
                  error={errors.phone}
                  type="tel"
                />
                <InputField
                  label="Email Address *"
                  register={register("email")}
                  error={errors.email}
                  type="email"
                />
                <InputField
                  label="Password *"
                  register={register("password")}
                  error={errors.password}
                  type="password"
                />
                <InputField
                  label="Image URL"
                  register={register("image.url")}
                  error={errors.image?.url}
                  type="url"
                />
                <InputField
                  label="Image Alt"
                  register={register("image.alt")}
                  error={errors.image?.alt}
                />
                <InputField
                  label="State"
                  register={register("address.state")}
                  error={errors.address?.state}
                />
                <InputField
                  label="Country *"
                  register={register("address.country")}
                  error={errors.address?.country}
                />
                <InputField
                  label="City *"
                  register={register("address.city")}
                  error={errors.address?.city}
                />
                <InputField
                  label="Street *"
                  register={register("address.street")}
                  error={errors.address?.street}
                />
                <InputField
                  label="House Number *"
                  register={register("address.houseNumber")}
                  error={errors.address?.houseNumber}
                  type="number"
                />
                <InputField
                  label="Zip *"
                  register={register("address.zip")}
                  error={errors.address?.zip}
                  type="number"
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="isBusiness" {...register("isBusiness")} />
                <Label htmlFor="isBusiness">Signup as business</Label>
              </div>
              <Button type="submit" disabled={!isValid}>
                Signup
              </Button>
            </form>
            <p className="mt-5 dark:text-white">
              Already have an account?{" "}
              <Link className="text-blue-600" to={"/login"}>
                login
              </Link>
            </p>
          </Card>
        </div>
      </main>
    </>
  );
};
export default Signup;
