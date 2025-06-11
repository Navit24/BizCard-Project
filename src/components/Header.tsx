import {
  Button,
  ButtonGroup,
  DarkThemeToggle,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
  TextInput,
} from "flowbite-react";
import { FiLogOut } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { userActions } from "../store/userSlice";
import type { TRootState } from "../store/store";
import Swal from "sweetalert2";
import { searchActions } from "../store/searchSlice";
import { IoMdSearch } from "react-icons/io";
// import { IoCreateOutline } from "react-icons/io5";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: TRootState) => state.userSlice.user);
  const location = useLocation();

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure you want to log out?",
      text: "You will need to sign in again to access your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        dispatch(userActions.logout());
        navigate("/");
      }
    });
  };
  return (
    <>
      <Navbar
        fluid
        rounded
        className="sticky top-0 z-50 bg-white/90 shadow-md backdrop-blur dark:bg-gray-800/90"
      >
        <NavbarBrand href="https://bizcard-project.onrender.com/">
          <span className="self-center text-xl font-extrabold whitespace-nowrap text-blue-600">
            BizCard
          </span>{" "}
        </NavbarBrand>
        <NavbarBrand>
          {" "}
          <TextInput
            className="mx-4"
            rightIcon={IoMdSearch}
            placeholder="Search"
            onChange={(e) =>
              dispatch(searchActions.setSearchWord(e.target.value))
            }
          />
        </NavbarBrand>

        <div className="flex md:order-2">
          {" "}
          {user && (
            <Link
              to={"/profile"}
              className="mx-4 flex items-center text-blue-600 hover:scale-105"
            >
              Hello, {user.name.first}
            </Link>
          )}
          {!user && (
            <ButtonGroup>
              {" "}
              <Button
                onClick={() => {
                  navigate("/signup");
                  localStorage.removeItem("userId");
                }}
                className="text-white"
              >
                Signup
              </Button>
              <Button
                onClick={() => {
                  navigate("/login");
                  localStorage.removeItem("userId");
                }}
                color="alternative"
                className="text-blue-600"
              >
                Login
              </Button>
            </ButtonGroup>
          )}
          <Button onClick={handleLogout} color="alternative" className="mx-2">
            <FiLogOut className="text-xl text-blue-600" />
          </Button>
          <DarkThemeToggle className="rounded-lg border border-gray-200 p-2 text-blue-600 hover:bg-gray-100" />
          <NavbarToggle />
        </div>

        <NavbarCollapse>
          <Link
            className={`${location.pathname === "/" ? "text-blue-600 dark:text-white" : "text-gray-700 hover:text-blue-600 dark:text-gray-400 hover:dark:text-white"}`}
            to="/"
          >
            Home
          </Link>
          <Link
            className={`${location.pathname === "/about" ? "text-blue-600 dark:text-white" : "text-gray-700 hover:text-blue-600 dark:text-gray-400 hover:dark:text-white"}`}
            to="/about"
          >
            About
          </Link>
          {user && (
            <Link
              className={`${location.pathname === "/favorites" ? "text-blue-600 dark:text-white" : "text-gray-700 hover:text-blue-600 dark:text-gray-400 hover:dark:text-white"}`}
              to="/favorites"
            >
              Favorites
            </Link>
          )}
          {(user?.isBusiness || user?.isAdmin) && (
            <Link
              className={`${location.pathname === "/my-cards" ? "text-blue-600 dark:text-white" : "text-gray-700 hover:text-blue-600 dark:text-gray-400 hover:dark:text-white"}`}
              to="/my-cards"
            >
              My Cards
            </Link>
          )}
          {user && (
            <Link
              className={`${location.pathname === "/profile" ? "text-blue-600 dark:text-white" : "text-gray-700 hover:text-blue-600 dark:text-gray-400 hover:dark:text-white"}`}
              to="/profile"
            >
              Profile
            </Link>
          )}
          {user?.isAdmin && (
            <Link
              className={`${location.pathname === "/admin-dashboard" ? "text-blue-600 dark:text-white" : "text-gray-700 hover:text-blue-600 dark:text-gray-400 hover:dark:text-white"}`}
              to="/admin-dashboard"
            >
              Admin Dashboard
            </Link>
          )}
        </NavbarCollapse>
        {(user?.isBusiness || user?.isAdmin) && (
          <NavbarBrand>
            <Button
              onClick={() => {
                navigate("/create-card");
              }}
              className="rounded-4xl bg-blue-600 hover:bg-blue-700"
            >
              {/* <IoCreateOutline className="text-xl mr-1" />  */}
              New Card
            </Button>
          </NavbarBrand>
        )}
      </Navbar>
    </>
  );
};
export default Header;
