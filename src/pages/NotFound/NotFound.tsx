import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { VscError } from "react-icons/vsc";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex h-screen items-center justify-center px-4">
        <div className="text-center">
          <VscError className="mx-auto mb-4 text-5xl text-gray-600" />
          <h1 className="text-9xl font-extrabold text-blue-600">404</h1>
          <p className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Page not found
          </p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
          <div className="mt-6">
            <Button
              className="inline-flex items-center"
              onClick={() => {
                navigate("/");
              }}
            >
              Go back home
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
