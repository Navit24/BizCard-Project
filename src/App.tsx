import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home/Home.page";
import About from "./pages/About/About.page";
import Favorites from "./pages/Favorites/Favorites.page";
import Signup from "./pages/SignUp/Signup";
import { Provider } from "react-redux";
import store from "./store/store";
import RouteGuard from "./components/RouteGuard";
import Profile from "./pages/Profile/Profile.page";
import MyCards from "./pages/MyCards/MyCard.page";
import Login from "./pages/LogIn/Login";
import EditProfile from "./pages/Profile/EditProfile";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { userActions } from "./store/userSlice";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import type { TUser } from "./types/TUser";
import CreateCard from "./pages/CreateCard/CreateCard";

// import CardDetails from "./components/CardDetails";

const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token) as TUser;
        axios.defaults.headers.common["x-auth-token"] = token;

        // מביא את פרטי המשתמש המעודכנים מהשרת
        axios
          .get(
            `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/${decodedToken._id}`,
          )
          .then((response) => {
            dispatch(userActions.login(response.data));
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
            localStorage.removeItem("token");
          });
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
      }
    }
  }, [dispatch]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/favorites"
          element={
            <RouteGuard>
              <Favorites />
            </RouteGuard>
          }
        />
        <Route
          path="/profile"
          element={
            <RouteGuard>
              <Profile />
            </RouteGuard>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <RouteGuard>
              <EditProfile />
            </RouteGuard>
          }
        />
        <Route
          path="/my-cards"
          element={
            <RouteGuard isBusiness={true}>
              <MyCards />
            </RouteGuard>
          }
        />
        <Route
          path="/create-card"
          element={
            <RouteGuard isBusiness={true}>
              <CreateCard />
            </RouteGuard>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/card-details/:id" element={<CardDetails/>} /> */}
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </BrowserRouter>
  );
}
