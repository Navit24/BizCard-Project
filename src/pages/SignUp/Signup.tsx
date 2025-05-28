import { Button, Card, Checkbox, FloatingLabel, Label } from "flowbite-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { joiResolver } from "@hookform/resolvers/joi";
import axios from "axios";

import { signupSchema } from "../../validations/signup.joi";
import type { TUser } from "../../types/TUser";

const Signup = () => {
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
  const submitForm = async (data: TUser) => {
    console.log("Form Submitted:", data);
    try {
      const response = await axios.post(
        "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users",
        data,
      );
      localStorage.setItem("token", response.data.token);
      console.log("Success");
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <>
      <main>
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <Card className="w-full max-w-xl text-center">
            <h1 className="text-2xl font-bold">SignUp</h1>{" "}
            <form
              onSubmit={handleSubmit(submitForm)}
              className="flex flex-col gap-4"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FloatingLabel
                  {...register("name.first")}
                  type="name"
                  variant="outlined"
                  label="First Name *"
                  color={errors.name?.first && "error"}
                />{" "}
                {errors.name?.first && (
                  <p className="text-sm text-red-500">
                    {errors.name.first.message}
                  </p>
                )}
                <FloatingLabel
                  {...register("name.middle")}
                  type="name"
                  variant="outlined"
                  label="Middle Name"
                  color={errors.name?.middle && "error"}
                />{" "}
                {errors.name?.middle && (
                  <p className="text-sm text-red-500">
                    {errors.name.middle.message}
                  </p>
                )}
                <FloatingLabel
                  {...register("name.last")}
                  type="name"
                  variant="outlined"
                  label="Last Name *"
                  color={errors.name?.last && "error"}
                />{" "}
                {errors.name?.last && (
                  <p className="text-sm text-red-500">
                    {errors.name.last.message}
                  </p>
                )}
                <FloatingLabel
                  {...register("phone")}
                  type="phone"
                  variant="outlined"
                  label="Phone *"
                  color={errors.phone && "error"}
                />{" "}
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
                <FloatingLabel
                  {...register("email")}
                  type="email"
                  variant="outlined"
                  label="Email Address *"
                  color={errors.email && "error"}
                />{" "}
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
                <FloatingLabel
                  {...register("password")}
                  type="password"
                  variant="outlined"
                  label="Password *"
                  color={errors.password && "error"}
                />{" "}
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
                <FloatingLabel
                  {...register("image.url")}
                  variant="outlined"
                  label="Image URL"
                  color={errors.image?.url && "error"}
                />{" "}
                {errors.image?.url && (
                  <p className="text-sm text-red-500">
                    {errors.image.url.message}
                  </p>
                )}
                <FloatingLabel
                  {...register("image.alt")}
                  variant="outlined"
                  label="Image Alt"
                  color={errors.image?.alt && "error"}
                />{" "}
                {errors.image?.alt && (
                  <p className="text-sm text-red-500">
                    {errors.image.alt.message}
                  </p>
                )}
                <FloatingLabel
                  {...register("address.state")}
                  variant="outlined"
                  label="State"
                  color={errors.address?.state && "error"}
                />{" "}
                {errors.address?.state && (
                  <p className="text-sm text-red-500">
                    {errors.address.state.message}
                  </p>
                )}{" "}
                <FloatingLabel
                  {...register("address.country")}
                  variant="outlined"
                  label="Country *"
                  color={errors.address?.country && "error"}
                />{" "}
                {errors.address?.country && (
                  <p className="text-sm text-red-500">
                    {errors.address.country.message}
                  </p>
                )}
                <FloatingLabel
                  {...register("address.city")}
                  variant="outlined"
                  label="City *"
                  color={errors.address?.city && "error"}
                />{" "}
                {errors.address?.city && (
                  <p className="text-sm text-red-500">
                    {errors.address.city.message}
                  </p>
                )}
                <FloatingLabel
                  {...register("address.street")}
                  variant="outlined"
                  label="Street *"
                  color={errors.address?.city && "error"}
                />{" "}
                {errors.address?.city && (
                  <p className="text-sm text-red-500">
                    {errors.address.city.message}
                  </p>
                )}
                <FloatingLabel
                  {...register("address.houseNumber")}
                  type="number"
                  variant="outlined"
                  label="House Number"
                  color={errors.address?.houseNumber && "error"}
                />{" "}
                {errors.address?.houseNumber && (
                  <p className="text-sm text-red-500">
                    {errors.address.houseNumber.message}
                  </p>
                )}
                <FloatingLabel
                  {...register("address.zip")}
                  type="number"
                  variant="outlined"
                  label="Zip"
                  color={errors.address?.zip && "error"}
                />{" "}
                {errors.address?.zip && (
                  <p className="text-sm text-red-500">
                    {errors.address.zip.message}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="isBusiness" {...register("isBusiness")} />
                <Label htmlFor="isBusiness">Signup as business</Label>
              </div>
              <Button type="submit" disabled={!isValid}>
                Signup
              </Button>
            </form>
            <p className="mt-5">
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
