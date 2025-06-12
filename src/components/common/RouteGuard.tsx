import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import type { TRootState } from "../store/store";
import { Navigate } from "react-router-dom";

type RouteGuardProps = {
  children: ReactNode;
  isBusiness?: boolean;
  isAdmin?: boolean;
};

// קומפוננטה להגנה על מסלולים - בודקת הרשאות משתמש ומפנה במידת הצורך
const RouteGuard = (props: RouteGuardProps) => {
  const { children, isBusiness, isAdmin } = props;

  // שליפת משתמש מהסטור
  const user = useSelector((state: TRootState) => {
    return state.userSlice.user;
  });

  // אם אין משתמש מחובר - הפניה לדף ההתחברות
  if (!user) {
    return <Navigate to="/Login" />;
  }

  //אם נדרש משתמש עסקי והמשתמש אינו עסקי- הפניה אל דף הבית
  if (isBusiness && !user.isBusiness) {
    return <Navigate to="/" />;
  }

  //אם נדרש משתמש אדמין והמשתמש אינו אדמין- הפניה אל דף הבית
  if (isAdmin && !user.isAdmin) {
    return <Navigate to="/" />;
  }

  // אם כל הבדיקות עוברות- הצגת הילדים
  return <>{children}</>;
};
export default RouteGuard;
