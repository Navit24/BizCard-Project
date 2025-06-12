import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import { MdDelete, MdModeEdit } from "react-icons/md";
import { FaHeart, FaPhone } from "react-icons/fa";
import { Card, Modal, ModalBody, ModalHeader } from "flowbite-react";

import type { TCard } from "../types/TCard";
import type { TRootState } from "../store/store";

type CardModalProps = {
  open: boolean;
  onClose: () => void;
  card: TCard | null;
  likeOrUnLikeCard: (cardId: string) => void;
};

const CardDetails = (props: CardModalProps) => {
  const { open, onClose, card, likeOrUnLikeCard } = props;
  const user = useSelector((state: TRootState) => state.userSlice.user);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // בדיקה האם המשתמש סימן את הכרטיס בלייק
  const isLiked = card?.likes.includes(user?._id + "");

  // מחיקת כרטיס לאחר אישור מהמשתמש
  const deleteCard = async (cardId: string) => {
    if (!token) return;

    // פופאפ אישור מחיקה
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete the card you created?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!result.isConfirmed) return;
    try {
      await axios.delete(
        `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${cardId}`,
        { headers: { "x-auth-token": token } },
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
    {/* מודל להצגת פרטי כרטיס */}
      <Modal show={open} onClose={onClose}>
        <ModalHeader className="border-gray-300">Card details</ModalHeader>
        <ModalBody>
          <div className="flex flex-wrap items-center justify-center dark:bg-gray-900">
            {card && (
              <Card
                key={card._id}
                className="m-5 w-full border-2 bg-white shadow-md transition-shadow hover:shadow-xl [&>img]:max-h-48 [&>img]:max-w-full"
                imgAlt={card.image.alt}
                imgSrc={card.image.url}
              >
                {/* פרטי כרטיס */}
                <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {card.title}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  {card.subtitle}
                </p>
                <hr className="border-gray-300" />
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  <b>Description:</b> {card.description}
                </p>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  <b>Phone:</b> {card.phone}
                </p>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  <b>Web:</b> {card.web}
                </p>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  <b>Address:</b> {card.address.street}
                  {card.address.houseNumber} {card.address.city}
                  {card.address.country}
                </p>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  <b>Card Number:</b> {card.bizNumber}
                </p>

                {/* אזור כפתורי אקשן */}
                <div className="flex items-center justify-between py-2">
                  {/* כפתורי עריכה ומחיקה (למשתמש עסקי שהוא יוצר הכרטיס) */}
                  <div className="flex gap-4">
                    {user?.isBusiness && user._id === card.user_id && (
                      <>
                        <MdDelete
                          onClick={() => deleteCard(card._id)}
                          className="cursor-pointer text-2xl text-blue-600 hover:scale-110"
                        />
                        <MdModeEdit
                          onClick={() => navigate("/edit-card/" + card._id)}
                          className="cursor-pointer text-2xl text-blue-600 hover:scale-110"
                        />
                      </>
                    )}
                  </div>

                  {/* כפתורי טלפון ולייק */}
                  <div className="flex gap-4">
                    <a href={`tel:${card.phone}`}>
                      <FaPhone className="cursor-pointer text-xl text-blue-600 hover:scale-110" />
                    </a>
                    {user && (
                      <FaHeart
                        className={`${isLiked ? "text-red-500" : "text-blue-400"} cursor-pointer text-xl hover:scale-110`}
                        onClick={() => likeOrUnLikeCard(card._id)}
                      />
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};
export default CardDetails;
