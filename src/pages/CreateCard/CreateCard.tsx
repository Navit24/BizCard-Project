import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type { TCard } from "../../types/TCard";
import { joiResolver } from "@hookform/resolvers/joi";
import { cardSchema } from "../../validations/card.joi";
import axios from "axios";
import Swal from "sweetalert2";
import { Button, FloatingLabel } from "flowbite-react";
import { RxReset } from "react-icons/rx";

const CreateCard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<TCard>({
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      phone: "",
      email: "",
      web: "",
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
    },
    mode: "onChange",
    resolver: joiResolver(cardSchema),
  });

  const submitForm = async (data: TCard) => {
    try {
      await axios.post(
        "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards",
        data,
        { headers: { "x-auth-token": token } },
      );

      console.log("Success");
      navigate("/my-cards");
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "Something went wrong while saving.", "error");
    }
  };

  return (
    <>
      <main>
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          {" "}
          <div className="w-full max-w-xl text-center">
            <h5 className="mb-4 flex text-2xl font-bold text-gray-900 dark:text-white">
              Create card
            </h5>
            <form
              onSubmit={handleSubmit(submitForm)}
              className="flex flex-col gap-4"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FloatingLabel
                  {...register("title")}
                  type="title"
                  variant="outlined"
                  label="Title *"
                  color={errors.title && "error"}
                />{" "}
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
                <FloatingLabel
                  {...register("subtitle")}
                  type="subtitle"
                  variant="outlined"
                  label="Subtitle"
                  color={errors.subtitle && "error"}
                />{" "}
                {errors.subtitle && (
                  <p className="text-sm text-red-500">
                    {errors.subtitle.message}
                  </p>
                )}
                <FloatingLabel
                  {...register("description")}
                  type="description"
                  variant="outlined"
                  label="Description *"
                  color={errors.description && "error"}
                />{" "}
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
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
                  label="Email *"
                  color={errors.email && "error"}
                />{" "}
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
                <FloatingLabel
                  {...register("web")}
                  type="web"
                  variant="outlined"
                  label="Web"
                  color={errors.web && "error"}
                />{" "}
                {errors.web && (
                  <p className="text-sm text-red-500">{errors.web.message}</p>
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
                  color={errors.address?.street && "error"}
                />{" "}
                {errors.address?.street && (
                  <p className="text-sm text-red-500">
                    {errors.address.street.message}
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
                )}{" "}
                <Button outline color="red" onClick={() => navigate(-1)}>
                  Cancel
                </Button>{" "}
                <Button onClick={() => reset()} outline color="blue">
                  <RxReset className="text-xl" />
                </Button>
              </div>{" "}
              <Button type="submit" disabled={!isValid}>
                Create
              </Button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default CreateCard;
