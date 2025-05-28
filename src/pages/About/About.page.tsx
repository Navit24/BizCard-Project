import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Card, Button } from "flowbite-react";
import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import {
  HiOutlineDatabase,
  HiOutlineUserGroup,
  HiOutlineCog,
} from "react-icons/hi";
import { MdEmail } from "react-icons/md";

const About = () => {
  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = {
    lat: 32.0853,
    lng: 34.7818,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-4xl font-bold">About Us</h1>

      <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-2xl font-bold">Who We Are?</h2>
          <p className="mb-4 text-gray-700">
            Welcome to BizCard! We provide an advanced digital business card
            management platform, enabling professionals and businesses to manage
            their business connections smartly and efficiently.
          </p>
          <p className="text-gray-700">
            Our platform was founded in 2024 with the mission to transform the
            world of business networking into a digital, accessible, and
            environmentally friendly experience.
          </p>
        </Card>

        <Card>
          <h2 className="mb-4 text-2xl font-bold">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-2 h-5 w-5 text-blue-600" />
              <span>50 Dizengoff Street, Tel Aviv, Israel</span>
            </div>
            <div className="flex items-center">
              <FaPhone className="mr-2 h-5 w-5 text-blue-600" />
              <span>03-1234567</span>
            </div>
            <div className="flex items-center">
              <MdEmail className="mr-2 h-5 w-5 text-blue-600" />
              <span>contact@bizcard.co.il</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mb-8">
        <h2 className="mb-6 text-2xl font-bold">What We Offer?</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <HiOutlineDatabase className="mb-4 h-12 w-12 text-blue-600" />
            <h3 className="mb-2 text-xl font-semibold">CRM System</h3>
            <p className="text-gray-700">
              Powerful admin dashboard with comprehensive CRM capabilities for
              managing business cards, contacts, and customer relationships
              efficiently.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <HiOutlineUserGroup className="mb-4 h-12 w-12 text-blue-600" />
            <h3 className="mb-2 text-xl font-semibold">User Management</h3>
            <p className="text-gray-700">
              Advanced user management system allowing admins to oversee user
              accounts, permissions, and access levels with ease.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <HiOutlineCog className="mb-4 h-12 w-12 text-blue-600" />
            <h3 className="mb-2 text-xl font-semibold">Customization</h3>
            <p className="text-gray-700">
              Flexible customization options for business cards, allowing users
              to create unique designs that represent their brand identity.
            </p>
          </div>
        </div>
      </Card>

      <Card className="mb-8 w-full">
        <h2 className="mb-4 text-2xl font-bold">Office Location</h2>
        <div className="overflow-hidden rounded-lg">
          <LoadScript googleMapsApiKey="AIzaSyByUR2i4O47BvSptCgC9q8jMIva4q50yFw">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={15}
            >
              <Marker position={center} />
            </GoogleMap>
          </LoadScript>
        </div>
      </Card>

      <div className="mt-8 text-center">
        <Button color="blue" pill>
          Contact Us
        </Button>
      </div>
    </div>
  );
};

export default About;
