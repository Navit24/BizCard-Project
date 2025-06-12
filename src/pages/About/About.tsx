import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Card, Button } from "flowbite-react";
import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { HiOutlineDatabase, HiOutlineUserGroup } from "react-icons/hi";
import { MdEmail } from "react-icons/md";
import { TiBusinessCard } from "react-icons/ti";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8 dark:bg-gray-900">
      <h1 className="mb-8 text-center text-4xl font-bold dark:text-white">
        About Us
      </h1>

      {/* מידע כללי על האתר ופרטי יצירת קשר */}
      <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-2xl font-bold dark:text-white">
            Who We Are?
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-400">
            Welcome to BizCard! We provide an advanced digital business card
            management platform, enabling professionals and businesses to manage
            their business connections smartly and efficiently.
          </p>
          <p className="text-gray-700 dark:text-gray-400">
            Our platform was founded in 2025 with the mission to transform the
            world of business networking into a digital, accessible, and
            environmentally friendly experience.
          </p>
        </Card>

        <Card>
          <h2 className="mb-4 text-2xl font-bold dark:text-white">
            Contact Information
          </h2>
          <div className="space-y-4 dark:text-gray-400">
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

      {/* כרטיס המציג את שירותי האתר */}
      <Card className="mb-8">
        <h2 className="mb-6 text-2xl font-bold dark:text-white">
          What We Offer?
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* עיון בכרטיסים */}
          <div className="flex flex-col items-center text-center">
            <HiOutlineUserGroup className="mb-4 h-12 w-12 text-blue-600" />
            <h3 className="mb-2 text-xl font-semibold dark:text-white">
              Browse
            </h3>
            <p className="text-gray-700 dark:text-gray-400">
              Explore a wide variety of business cards and connect with
              professionals across industries.
            </p>
          </div>

          {/* יצירת כרטיס חדש */}
          <div className="flex flex-col items-center text-center">
            <TiBusinessCard className="mb-4 h-12 w-12 text-blue-600" />
            <h3 className="mb-2 text-xl font-semibold dark:text-white">
              Create
            </h3>
            <p className="text-gray-700 dark:text-gray-400">
              Create design your own business card and customize it to reflect
              your personal or business brand.
            </p>
          </div>

          {/* מערכת ניהול  */}
          <div className="flex flex-col items-center text-center">
            <HiOutlineDatabase className="mb-4 h-12 w-12 text-blue-600" />
            <h3 className="mb-2 text-xl font-semibold dark:text-white">
              CRM System
            </h3>
            <p className="text-gray-700 dark:text-gray-400">
              Our powerful CRM tools empower admins to efficiently manage
              business cards, user data, and key business relationships.
            </p>
          </div>
        </div>
      </Card>

      {/* מפת מיקום */}
      <Card className="mb-8 w-full">
        <h2 className="mb-4 text-2xl font-bold dark:text-white">
          Office Location
        </h2>
        <div className="overflow-hidden rounded-lg">
          <LoadScript googleMapsApiKey="AIzaSyByUR2i4O47BvSptCgC9q8jMIva4q50yFw">
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "400px" }}
              center={{ lat: 32.0853, lng: 34.7818 }}
              zoom={15}
            >
              <Marker position={{ lat: 32.0853, lng: 34.7818 }} />
            </GoogleMap>
          </LoadScript>
        </div>
      </Card>

      <div className="mt-8 text-center">
        <a href="mailto:contact@bizcard.co.il">
          <Button outline pill>
            <MdEmail className="mr-2 h-5 w-5" /> Email Us
          </Button>
        </a>
      </div>
    </div>
  );
};

export default About;
