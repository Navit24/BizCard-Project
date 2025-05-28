import { joiResolver } from "@hookform/resolvers/joi";
import { Button, FloatingLabel } from "flowbite-react";
import type { TUser } from "../../types/TUser";
import axios from "axios";
import { useForm } from "react-hook-form";
import type { TRootState } from "../../store/store";
// import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";
import { editProfileSchema } from "../../validations/editProfile.joi";
import Swal from "sweetalert2";

const EditProfile = () => {
  const navigate = useNavigate();
  const user = useSelector((state: TRootState) => state.userSlice.user);
  const userId = user?._id;
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    // reset,
    // trigger,
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
    resolver: joiResolver(editProfileSchema),
  });
  const submitForm = async (data: TUser) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to save the changes?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, save it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;
    console.log("Form Submitted:", data);
    try {
      const response = await axios.patch(
        `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/${userId}`,
        data,
        {
          headers: {
            "x-auth-token": token,
          },
        },
      );
      localStorage.setItem("token", response.data.token);
      dispatch(userActions.login(response.data));
      console.log("Success");
      navigate("/profile");
      Swal.fire("Saved!", "Your profile has been updated.", "success");
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "Something went wrong while saving.", "error");
    }
  };
  // useEffect(() => {
  //   console.log("USER:", user);
  //   if (user) {
  //     reset(user);
  //     trigger();
  //   }
  // }, [user, reset, trigger]);
  return (
    <>
      <main>
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="w-full max-w-xl text-center">
            <h5 className="mb-4 flex text-2xl font-bold text-gray-900 dark:text-white">
              Edit Your Profile
            </h5>{" "}
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
              </div>

              <Button type="submit" disabled={!isValid}>
                Save Changes
              </Button>
              <Button onClick={() => navigate(-1)}>Cancel</Button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};
export default EditProfile;
