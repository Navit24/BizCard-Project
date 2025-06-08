import { Button, Card, FloatingLabel } from "flowbite-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { joiResolver } from "@hookform/resolvers/joi";
import axios from "axios";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { loginSchema } from "../../validations/login.joi";
import type { TUser } from "../../types/TUser";
import { userActions } from "../../store/userSlice";

type TFormData = {
  email: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<TFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
    resolver: joiResolver(loginSchema),
  });
  const submitForm = async (data: TFormData) => {
    console.log("Form Submitted:", data);
    try {
      const token = await axios.post(
        "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/login",
        data,
      );
      localStorage.setItem("token", token.data);
      console.log("Success");
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "You have successfully connected",
        showConfirmButton: false,
        timer: 2000,
      });
      navigate("/");

      const parsedToken = jwtDecode(token.data) as TUser;
      console.log(parsedToken);
      axios.defaults.headers.common["x-auth-token"] = token.data;
      const response = await axios.get(
        "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/" +
          parsedToken._id,
      );
      dispatch(userActions.login(response.data));
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Login failed",
        text: "Invalid email or password",
        showConfirmButton: true,
        confirmButtonText: "Try again",
      });
    }
  };
  return (
    <>
      <main>
        <div className="flex min-h-screen items-center justify-center ">
          <Card className="w-full max-w-sm text-center">
            <h1 className="text-2xl font-bold">Login</h1>{" "}
            <form
              onSubmit={handleSubmit(submitForm)}
              className="flex flex-col gap-4"
            >
              <FloatingLabel
                {...register("email")}
                type="email"
                variant="outlined"
                label="Email Address"
                color={errors.password && "error"}
              />{" "}
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
              <FloatingLabel
                {...register("password")}
                type="password"
                variant="outlined"
                label="Password"
                color={errors.password && "error"}
              />{" "}
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
              <Button type="submit" disabled={!isValid}>
                Login
              </Button>
            </form>
            <p className="mt-5">
              Don't have an account?{" "}
              <Link className="text-blue-600" to={"/signup"}>
                Sign up
              </Link>
            </p>
          </Card>
        </div>
      </main>
    </>
  );
};
export default Login;
