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
import EditCard from "./pages/EditCard/EditCard";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import NotFound from "./pages/NotFound/NotFound";

// קומפוננטה ראשית שמטפלת בטעינת המשתמש במידה ויש טוקן שמור
const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // פונקציה אסינכרונית לטעינת פרטי המשתמש אם יש טוקן
    const getUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        // פענוח הטוקן לקבלת פרטי משתמש
        const decodedToken = jwtDecode(token) as TUser;
        axios.defaults.headers.common["x-auth-token"] = token;

        // בקשה לשרת לקבלת פרטי המשתמש המלאים לפי מזהה
        const response = await axios.get(
          `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/${decodedToken._id}`,
        );
        // עדכון הסטייס של המשתמש ברידקס
        dispatch(userActions.login(response.data));
      } catch (error) {
        // במקרה של שגיאה - מחיקת הטוקן מהלוקל סטורג והצגת שגיאה בקונסול
        console.error("Error fetching or decoding user:", error);
        localStorage.removeItem("token");
      }
    };

    getUser();
  }, [dispatch]);

  return (
    <>
      <Header />
      {/* מיפוי הנתיבים והגנה על מסלולים פרטיים */}
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
          path="/edit-profile/:id"
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
        <Route
          path="/admin-dashboard"
          element={
            <RouteGuard isAdmin={true}>
              <AdminDashboard />
            </RouteGuard>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/edit-card/:id"
          element={
            <RouteGuard isBusiness={true}>
              <EditCard />
            </RouteGuard>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

// קומפוננטת השורש שמריצה את כל האפליקציה
export default function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </BrowserRouter>
  );
}
