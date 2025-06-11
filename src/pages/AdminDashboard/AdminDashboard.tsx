import axios from "axios";
import {
  Button,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { TRootState } from "../../store/store";
import type { TUser } from "../../types/TUser";
import { FaUser, FaUserTie } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";

// קומפוננטת כפתור להחלפת סטטוס עסקי עם ספינר קטן בעת שינוי
const StatusToggle = ({
  userId,
  isBusiness,
  isAdmin,
  onToggle,
  isLoading,
}: {
  userId: string;
  isBusiness: boolean;
  isAdmin: boolean;
  onToggle: (userId: string) => void;
  isLoading: boolean;
}) => {
  if (isAdmin) return <span className="text-gray-400">N/A</span>;

  return (
    <button
      onClick={() => onToggle(userId)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
        isBusiness ? "bg-green-500" : "bg-gray-300"
      }`}
      disabled={isLoading}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
          isBusiness ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
};

const AdminDashboard = () => {
  const [users, setUsers] = useState<TUser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // טוען ראשי
  const [statusLoading, setStatusLoading] = useState<string | null>(null); // ID של יוזר שטוען שינוי סטטוס

  const rowsPerPage = 12;
  const searchWord = useSelector(
    (state: TRootState) => state.searchSlice.searchWord,
  );

  const getAllUsers = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await axios.get(
        "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users",
        { headers: { "x-auth-token": token || "" } },
      );
      setUsers(response.data);
    } catch (error) {
      console.log("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBusinessStatus = async (userId: string) => {
    const token = localStorage.getItem("token");
    setStatusLoading(userId); // סימון ID של משתמש שטוען
    try {
      await axios.patch(
        `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/${userId}`,
        {},
        {
          headers: {
            "x-auth-token": token || "",
          },
        },
      );
      getAllUsers();
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setStatusLoading(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    return (
      user.name.first.toLowerCase().includes(searchWord.toLowerCase()) ||
      user.name.last.toLowerCase().includes(searchWord.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchWord.toLowerCase()) ||
      user.email.toLowerCase().includes(searchWord.toLowerCase()) ||
      user.address.city.toLowerCase().includes(searchWord.toLowerCase())
    );
  });

  const currentRows = filteredUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  useEffect(() => {
    getAllUsers();
  }, []);
  const deleteUser = async (userId: string) => {
    const token = localStorage.getItem("token");

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to restore this user after deletion!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/${userId}`,
          {
            headers: { "x-auth-token": token || "" },
          },
        );

        Swal.fire({
          title: "Deleted!",
          text: "The user was successfully deleted.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        getAllUsers(); // רענון הרשימה
      } catch (error) {
        Swal.fire({
          title: "error",
          text: "The user could not be deleted.",
          icon: "error",
        });
      }
    }
  };

  return (
    <main className="p-5">
      <h5 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        User Management
      </h5>

      {loading ? (
        // ספינר גדול במרכז בעת טעינה
        <div className="flex h-60 items-center justify-center">
          <Spinner color="info" size="xl" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table hoverable>
              <TableHead>
                <TableRow>
                  <TableHeadCell className="p-4">PROFILE</TableHeadCell>
                  <TableHeadCell>NAME</TableHeadCell>
                  <TableHeadCell>EMAIL</TableHeadCell>
                  <TableHeadCell>ADDRESS</TableHeadCell>
                  <TableHeadCell>PHONE</TableHeadCell>
                  <TableHeadCell>STATUS</TableHeadCell>
                  <TableHeadCell>CHANGE STATUS</TableHeadCell>
                  <TableHeadCell>ACTIONS</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y">
                {currentRows.map((user) => (
                  <TableRow key={user._id}>
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
                    <TableCell>
                      {user.address.street} {user.address.houseNumber}{" "}
                      {user.address.city} {user.address.country}
                    </TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                      {user.isAdmin ? (
                        <p className="flex items-center gap-2 text-red-600">
                          <RiAdminFill />
                          Admin
                        </p>
                      ) : user.isBusiness ? (
                        <p className="flex items-center gap-2 text-blue-600">
                          <FaUserTie />
                          Business
                        </p>
                      ) : (
                        <p className="flex items-center gap-2">
                          <FaUser />
                          Regular
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusToggle
                        userId={user._id}
                        isBusiness={user.isBusiness}
                        isAdmin={user.isAdmin}
                        onToggle={toggleBusinessStatus}
                        isLoading={statusLoading === user._id}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        color="red"
                        className="rounded-full"
                        onClick={() => deleteUser(user._id)}
                        disabled={user.isAdmin} // אין אפשרות למחוק אדמין
                      >
                        <MdDelete className="text-xl" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* דפדוף */}
          <div className="my-5 flex overflow-x-auto sm:justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              showIcons
            />
          </div>
        </>
      )}
    </main>
  );
};

export default AdminDashboard;
