import {
  Button,
  ButtonGroup,
  DarkThemeToggle,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  TextInput,
} from "flowbite-react";
import { FiLogOut } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import { Link, useNavigate } from "react-router-dom";
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
          <ButtonGroup>
            {" "}
            <Button
              onClick={() => {
                navigate("/signup");
                localStorage.removeItem("userId");
              }}
              color="alternative"
              className="text-blue-600"
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
          <Button onClick={handleLogout} color="alternative" className="mx-2">
            <FiLogOut className="text-xl text-blue-600" />
          </Button>
          <Button color="alternative" className="p-0">
            <DarkThemeToggle className="text-blue-600" />
          </Button>
          <NavbarToggle />
        </div>
        <NavbarCollapse>
          <NavbarLink active>
            <Link to="/">Home</Link>
          </NavbarLink>
          <NavbarLink>
            <Link to="/about">About</Link>
          </NavbarLink>
          {user && (
            <NavbarLink>
              <Link to="/favorites">Favorites</Link>
            </NavbarLink>
          )}
          {user && user.isBusiness && (
            <NavbarLink>
              <Link to="/my-cards">My Cards</Link>
            </NavbarLink>
          )}
          {user && (
            <NavbarLink>
              <Link to="/profile">Profile</Link>
            </NavbarLink>
          )}
          {user?.isAdmin && (
            <NavbarLink>
              <Link to="/admin-dashboard">Admin Dashboard</Link>
            </NavbarLink>
          )}
        </NavbarCollapse>
        {user && user.isBusiness && (
          <NavbarBrand>
            <Button
              onClick={() => {
                navigate("/create-card");
              }}
              className="rounded-4xl bg-blue-600 hover:bg-blue-700"
            >
              {/* <IoCreateOutline className="text-xl mr-1" />  */}
              Create card
            </Button>
          </NavbarBrand>
        )}
      </Navbar>
    </>
  );
};
export default Header;
