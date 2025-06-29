import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Favorites from "./pages/Favorites/Favorites";
import Signup from "./pages/SignUp/Signup";
import { Provider } from "react-redux";
import store from "./store/store";
import Profile from "./pages/Profile/Profile";
import MyCards from "./pages/MyCards/MyCard";
import Login from "./pages/LogIn/Login";
import EditProfile from "./pages/Profile/EditProfile";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import type { TUser } from "./types/TUser";
import CreateCard from "./pages/CreateCard/CreateCard";
import EditCard from "./pages/EditCard/EditCard";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import NotFound from "./pages/NotFound/NotFound";
import RouteGuard from "./components/common/RouteGuard";
import SiteFooter from "./components/layout/SiteFooter";
import Header from "./components/layout/Header";
import { userActions } from "./store/slices/userSlice";

// קומפוננטה ראשית שמטפלת בטעינת המשתמש במידה ויש טוקן שמור
const AppContent = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // פונקציה אסינכרונית לטעינת פרטי המשתמש אם יש טוקן
    const getUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }

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
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, [dispatch]);

  // כל עוד בטעינה - נציג מסך טעינה זמני
  if (isLoading) return <div className="mt-10 h-screen text-center"></div>;
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
      <SiteFooter />
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
