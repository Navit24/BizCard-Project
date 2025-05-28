import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import type { TRootState } from "../store/store";
import { Navigate } from "react-router-dom";

// Type for the component's props
type RouteGuardProps = {
  children: ReactNode;
  isBusiness?: boolean;
  isAdmin?: boolean;
};

const RouteGuard = (props: RouteGuardProps) => {
  const { children, isBusiness, isAdmin } = props;

  //   Get the current user from the Redux store
  const user = useSelector((state: TRootState) => {
    return state.userSlice.user;
  });

  // If no user is logged in – redirect to the sign-in page
  if (!user) {
    return <Navigate to="/Login" />;
  }

  // If the route requires a business user and the user is not a business – redirect to home
  if (isBusiness && !user.isBusiness) {
    return <Navigate to="/" />;
  }

  // If the route requires an admin and the user is not an admin – redirect to home
  if (isAdmin && !user.isAdmin) {
    return <Navigate to="/" />;
  }

  // If all checks pass – render the protected children
  return <>{children}</>;
};
export default RouteGuard;
