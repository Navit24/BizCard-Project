import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import type { TCard } from "../../types/TCard";
import { joiResolver } from "@hookform/resolvers/joi";
import { cardSchema } from "../../validations/card.joi";
import axios from "axios";
import Swal from "sweetalert2";
import { Button, Card } from "flowbite-react";
import { RxReset } from "react-icons/rx";
import InputField from "../../components/InputField";

const EditCard = () => {
  const { id } = useParams<{ id: string }>();
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
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to save the changes?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, save it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;
    try {
       await axios.put(
        `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${id}`,
        data,
        {
          headers: {
            "x-auth-token": token,
          },
        },
      );
     

      navigate("/my-cards");
      Swal.fire("Saved!", "Your card has been updated.", "success");
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "Something went wrong while saving.", "error");
    }
  };

  return (
    <>
      <main>
        <div className="flex min-h-screen items-center justify-center">
          <div className="w-full max-w-xl text-center">
            <Card className="w-full max-w-xl text-center">
              <h5 className="text-2xl font-bold text-gray-900 dark:text-white">
                Edit card
              </h5>
              <form
                onSubmit={handleSubmit(submitForm)}
                className="flex flex-col gap-4"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <InputField
                    label="Title *"
                    register={register("title")}
                    error={errors.title}
                  />
                  <InputField
                    label="Subtitle *"
                    register={register("subtitle")}
                    error={errors.subtitle}
                  />
                  <InputField
                    label="Description *"
                    register={register("description")}
                    error={errors.description}
                  />
                  <InputField
                    label="Phone *"
                    register={register("phone")}
                    error={errors.phone}
                    type="tel"
                  />
                  <InputField
                    label="Email *"
                    register={register("email")}
                    error={errors.email}
                    type="email"
                  />
                  <InputField
                    label="Web"
                    register={register("web")}
                    error={errors.web}
                    type="url"
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
                    type="number"
                    register={register("address.houseNumber")}
                    error={errors.address?.houseNumber}
                  />
                  <InputField
                    label="Zip *"
                    type="number"
                    register={register("address.zip")}
                    error={errors.address?.zip}
                  />
                </div>{" "}
                <div className="flex justify-around gap-4">
                  <Button
                    className="w-100 bg-red-100"
                    outline
                    color="red"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="w-100 bg-gray-100"
                    onClick={() => reset()}
                    outline
                    color="gray"
                  >
                    <RxReset className="text-xl" />
                  </Button>
                </div>
                <Button type="submit" disabled={!isValid}>
                  Save Changes
                </Button>
              </form>{" "}
            </Card>
          </div>
        </div>
      </main>
    </>
  );
};
export default EditCard;
