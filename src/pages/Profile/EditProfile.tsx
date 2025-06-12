import { joiResolver } from "@hookform/resolvers/joi";
import { Button, Card } from "flowbite-react";
import type { TUser } from "../../types/TUser";
import axios from "axios";
import { useForm } from "react-hook-form";
import type { TRootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { editProfileSchema } from "../../validations/userValidations/editProfile.joi";
import Swal from "sweetalert2";
import { RxReset } from "react-icons/rx";
import InputField from "../../components/common/InputField";
import { useEffect } from "react";
import { userActions } from "../../store/slices/userSlice";

// קומפוננטה לעריכת פרטי משתמש
const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: TRootState) => state.userSlice.user);
  const userId = user?._id;
  const token = localStorage.getItem("token");

  // אתחול הטופס עם ערכי המשתמש הקיימים
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<TUser>({
    mode: "onChange",
    resolver: joiResolver(editProfileSchema),
  });

  useEffect(() => {
    if (user) {
      const safeUser = {
        name: {
          first: user.name?.first || "",
          middle: user.name?.middle || "",
          last: user.name?.last || "",
        },
        phone: user.phone || "",
        email: user.email || "",
        image: {
          url: user.image?.url || "",
          alt: user.image?.alt || "",
        },
        address: {
          state: user.address?.state || "",
          country: user.address?.country || "",
          city: user.address?.city || "",
          street: user.address?.street || "",
          houseNumber: user.address?.houseNumber || 1,
          zip: user.address?.zip || 0,
        },
        isBusiness: user.isBusiness || false,
        isAdmin: user.isAdmin || false,
      };
      reset(safeUser);
    }
  }, [user, reset]);

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
    const { _id, email, password, isBusiness, isAdmin, ...dataToSend } = data;

    try {
      const response = await axios.put(
        `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/${userId}`,
        dataToSend,
        {
          headers: {
            "x-auth-token": token,
          },
        },
      );
      // שמירת הטוקן החדש (אם קיים)
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      // שליפת נתוני המשתמש המעודכנים מהשרת
      const userResponse = await axios.get(
        `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/${userId}`,
        {
          headers: {
            "x-auth-token": response.data.token || token,
          },
        },
      );
      dispatch(userActions.login(userResponse.data));
      navigate("/profile");
      Swal.fire("Saved!", "Your profile has been updated.", "success");
    } catch (error: any) {
      Swal.fire("Error", "Something went wrong while saving.", "error");
    }
  };

  return (
    <>
      <main>
        <div className="flex min-h-screen items-center justify-center dark:bg-gray-900">
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
                <div className="flex justify-around gap-4">
                  <Button
                    className="w-100 bg-red-100 dark:bg-red-800 dark:text-white"
                    outline
                    color="red"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="w-100 bg-gray-100 dark:bg-gray-900"
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
              </form>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
};
export default EditProfile;
