import axios from "axios";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { useEffect, useState } from "react";
import type { TUser } from "../../types/TUser";
import { FaUser, FaUserTie } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";

const AdminDashboard = () => {
  const toggleBusinessStatus = async (userId: string) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.patch(
        `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/${userId}`,
        {},
        {
          headers: {
            "x-auth-token": token || "",
          },
        },
      );
      console.log("Status updated:", response.data);
      // לאחר שינוי הסטטוס, נטען את המשתמשים מחדש
      getAllUsers();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };
  const StatusToggle = ({
    userId,
    isBusiness,
    onToggle,
  }: {
    userId: string;
    isBusiness: boolean;
    onToggle: (userId: string) => void;
  }) => {
    return (
      <button
        onClick={() => onToggle(userId)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
          isBusiness ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
            isBusiness ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    );
  };

  const [users, setUsers] = useState<TUser[]>([]);

  const getAllUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users",
        { headers: { "x-auth-token": token || "" } },
      );
      setUsers(response.data);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <>
      <main className="p-5">
        <h5 className="mb-4 flex text-2xl font-bold text-gray-900 dark:text-white">
          User Management
        </h5>

        <div className="overflow-x-auto">
          <Table hoverable>
            <TableHead>
              <TableRow>
                <TableHeadCell className="p-4">PROFILE</TableHeadCell>
                <TableHeadCell>NAME</TableHeadCell>
                <TableHeadCell>EMAIL</TableHeadCell>
                <TableHeadCell>PHONE</TableHeadCell>
                <TableHeadCell>STATUS</TableHeadCell>
                <TableHeadCell>CHANGE STATUS</TableHeadCell>
                <TableHeadCell>ACTIONS</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {users.map((user) => (
                <TableRow
                  key={user._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <TableCell className="p-4">
                    <img
                      src={user.image?.url}
                      alt={user.image?.alt}
                      className="h-10 w-10 rounded-full"
                    />
                  </TableCell>
                  <TableCell>
                    {user.name.last} {user.name.first}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    {(user?.isAdmin && (
                      <p className="flex items-center gap-2 text-red-600">
                        <RiAdminFill />
                        Admin
                      </p>
                    )) ||
                      (user?.isBusiness ? (
                        <p className="flex items-center gap-2 text-blue-600">
                          <FaUserTie />
                          Business
                        </p>
                      ) : (
                        <p className="flex items-center gap-2">
                          <FaUser />
                          Regular
                        </p>
                      ))}
                  </TableCell>
                  <TableCell>
                    {" "}
                    <StatusToggle
                      userId={user._id}
                      isBusiness={user.isBusiness}
                      onToggle={toggleBusinessStatus}
                    />
                  </TableCell>
                  <TableCell>
                    {" "}
                    <Button color="red" className="rounded-full">
                      <MdDelete className="text-xl"/> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </>
  );
};
export default AdminDashboard;
