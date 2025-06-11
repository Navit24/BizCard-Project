import { joiResolver } from "@hookform/resolvers/joi";
import { Button, Card } from "flowbite-react";
import type { TUser } from "../../types/TUser";
import axios from "axios";
import { useForm } from "react-hook-form";
import type { TRootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";
import { editProfileSchema } from "../../validations/editProfile.joi";
import Swal from "sweetalert2";
import { RxReset } from "react-icons/rx";
import InputField from "../../components/InputField";

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: TRootState) => state.userSlice.user);
  const userId = user?._id;
  const token = localStorage.getItem("token");

  // אתחול הטופס עם ערכי ברירת מחדל ווילדציה
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<TUser>({
    defaultValues: {
      name: { first: "", middle: "", last: "" },
      phone: "",
      email: "",
      image: { url: "", alt: "" },
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
    resolver: joiResolver(editProfileSchema),
  });

  // שליחת הטופס לאחר אישור המשתמש
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
      navigate("/profile");
      Swal.fire("Saved!", "Your profile has been updated.", "success");
    } catch (error) {
      Swal.fire("Error", "Something went wrong while saving.", "error");
    }
  };

  return (
    <>
      <main>
        <div className="flex min-h-screen items-center justify-center">
          <div className="w-full max-w-xl text-center">
            <Card className="w-full max-w-xl text-center">
              <h5 className="flex text-2xl font-bold text-gray-900 dark:text-white">
                Edit Your Profile
              </h5>
              {/* טופס עריכת פרופיל */}
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
                  {/* שדות אימייל וטלפון */}
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

                  {/* שדות תמונה */}
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
                  {/* כתובת מלאה */}
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
                {/* כפתורים */}
                <Button outline color="red" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button onClick={() => reset()} outline color="blue">
                  <RxReset className="text-xl" />
                </Button>
                <Button type="submit" disabled={!isValid}>
                  Save Changes
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
};
export default EditProfile;
