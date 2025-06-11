import { useEffect, useState } from "react";
import type { TCard } from "../../types/TCard";
import { useSelector } from "react-redux";
import type { TRootState } from "../../store/store";
import axios from "axios";
import CardDetails from "../../components/CardDetails";
import { Card } from "flowbite-react";
import { FaHeart, FaPhone } from "react-icons/fa";
import { MdDelete, MdModeEdit } from "react-icons/md";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const MyCards = () => {
  const [cards, setCards] = useState<TCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<TCard | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const searchWord = useSelector(
    (state: TRootState) => state.searchSlice.searchWord,
  );
  const user = useSelector((state: TRootState) => state.userSlice.user);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    getMyCards();
  }, []);

  const getMyCards = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/my-cards",
        { headers: { "x-auth-token": token || "" } },
      );
      setCards(response.data);
    } catch (error) {
      console.error("Error fetching my cards:", error);
    }
  };
  // ---מחיקת כרטיס---
  const deleteCard = async (cardId: string) => {
    if (!token) return;
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

      // הסרת כרטיס מהרשימה המקומית
      setCards((prev) => prev.filter((card) => card._id !== cardId));
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const likeOrUnLikeCard = async (cardId: string) => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["x-auth-token"] = token;

      await axios.patch(
        `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${cardId}`,
      );

      const cardIndex = cards.findIndex((card) => card._id === cardId);
      const updatedCards = [...cards];
      const card = updatedCards[cardIndex];

      if (card.likes.includes(user?._id + "")) {
        card.likes = card.likes.filter((id) => id !== user?._id + "");
      } else {
        card.likes.push(user?._id + "");
      }

      updatedCards[cardIndex] = card;
      setCards(updatedCards);
    } catch (error) {
      console.log("Error liking/unliking card:", error);
    }
  };
  const filterBySearch = cards.filter((card) =>
    [card.title, card.subtitle, card.phone, card.description].some((field) =>
      field.toLowerCase().includes(searchWord.toLowerCase()),
    ),
  );

  return (
    <>
      <div className="p-4 dark:bg-gray-900">
        {/* כותרות */}
        <div className="bg m-8 flex flex-col items-center text-gray-900">
          <h4 className="text-4xl font-bold dark:text-white">My Cards Pages</h4>
          <h5 className="mt-2 text-xl font-normal text-gray-700 dark:text-white">
            Here you can view all the cards you've created, as well as edit or
            delete them
          </h5>
        </div>{" "}
        <div className="flex flex-wrap items-center justify-center gap-4 p-4">
          {filterBySearch.length === 0 ? (
            <p className="mt-4 text-gray-500">
              No cards you created were found.
            </p>
          ) : (
            filterBySearch.map((card) => {
              const isLiked = card.likes.includes(user?._id + "");

              return (
                <Card
                  key={card._id}
                  className="w-80 border-2 border-blue-600 bg-white shadow-md hover:shadow-xl [&>img]:max-h-48 [&>img]:max-w-full"
                  imgAlt={card.image.alt}
                  imgSrc={card.image.url}
                >
                  <h5 className="text-xl font-bold text-gray-900 dark:text-white">
                    {card.title}
                  </h5>
                  <p className="text-gray-700 dark:text-gray-400">
                    {card.subtitle}
                  </p>
                  <hr />
                  <p className="text-gray-700 dark:text-gray-400">
                    <b>Phone:</b> {card.phone}
                  </p>
                  <p className="text-gray-700 dark:text-gray-400">
                    <b>Address:</b> {card.address.street}{" "}
                    {card.address.houseNumber}, {card.address.city}
                  </p>
                  <p className="text-gray-700 dark:text-gray-400">
                    <b>Card Number:</b> {card.bizNumber}
                  </p>
                  <div className="flex justify-start">
                    <button
                      onClick={() => {
                        setSelectedCard(card);
                        setOpenModal(true);
                      }}
                      className="hover:bg-blue-20 flex items-center gap-1 rounded-md bg-blue-100 px-2 py-1 text-sm font-medium text-blue-600 transition-transform duration-200 hover:scale-105"
                    >
                      Click to see more →
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-2">
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
              );
            })
          )}
        </div>
        <CardDetails
          open={openModal}
          onClose={() => setOpenModal(false)}
          card={selectedCard}
          likeOrUnLikeCard={likeOrUnLikeCard}
        />
      </div>
    </>
  );
};
export default MyCards;
