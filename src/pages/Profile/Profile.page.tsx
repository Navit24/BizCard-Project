import { Card } from "flowbite-react";
import { useSelector } from "react-redux";
import type { TRootState } from "../../store/store";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
  FaUserEdit,
  FaUserTie,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";
import {  useNavigate } from "react-router-dom";

const Profile = () => {
  const user = useSelector((state: TRootState) => state.userSlice.user);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center pt-10">
      <div className="mb-4 flex w-full max-w-lg items-center justify-between px-2">
        <h5 className="text-2xl font-bold text-gray-900 dark:text-white">
          Your Profile
        </h5>
        <button
          onClick={() => {
            navigate("/edit-profile");
          }}
          className="flex items-center gap-1 rounded bg-blue-600 px-3 py-1 text-white transition hover:bg-blue-700"
        >
          <FaUserEdit />
          Edit Profile
        </button>
      </div>
      <Card className="w-full max-w-lg p-2 shadow-lg">
        <div className="flex flex-col items-center sm:flex-row sm:items-center sm:gap-6">
          <img
            src={user?.image.url}
            alt={user?.image.alt}
            className="h-32 w-32 rounded-full object-cover"
          />
          <div className="mt-4 text-center sm:mt-0 sm:text-left">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {user?.name.first} {user?.name.last}
            </h5>
            <div className="flex justify-start">
              <p className="mt-3 flex items-center rounded-md bg-blue-100 px-2 py-1 text-sm font-medium text-blue-600 transition-transform duration-200">
                {}
                {(user?.isAdmin && (
                  <p className="flex items-center gap-2">
                    <RiAdminFill />
                    Admin User
                  </p>
                )) ||
                  (user?.isBusiness ? (
                    <p className="flex items-center gap-2">
                      <FaUserTie />
                      Business User
                    </p>
                  ) : (
                    <p className="flex items-center gap-2">
                      <FaUser />
                      Regular User
                    </p>
                  ))}
              </p>
            </div>
            <p className="mt-2 flex items-center gap-2 font-normal text-gray-700 dark:text-gray-400">
              <MdEmail className="text-blue-600" />
              {user?.email}
            </p>
            <p className="mt-2 flex items-center gap-2 font-normal text-gray-700 dark:text-gray-400">
              <FaPhone className="text-blue-600" />
              {user?.phone}
            </p>
            <p className="mt-2 flex items-center gap-2 font-normal text-gray-700 dark:text-gray-400">
              <FaMapMarkerAlt className="text-blue-600" />{" "}
              {user?.address.street} {user?.address.houseNumber}{" "}
              {user?.address.city} {user?.address.country}
            </p>{" "}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
