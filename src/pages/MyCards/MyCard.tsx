import { useEffect, useState } from "react";
import type { TCard } from "../../types/TCard";
import { useSelector } from "react-redux";
import type { TRootState } from "../../store/store";
import axios from "axios";
import { Card } from "flowbite-react";
import { FaHeart, FaPhone } from "react-icons/fa";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  deleteCard,
  likeOrUnLikeCard,
  filterBySearch,
} from "../../utils/cardUtils";
import CardDetails from "../../components/cards/CardDetails";

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

  // שליפת כרטיסים שנוצרו על ידי המשתמש בעת טעינת הדף
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

  // לייק או הסרת לייק על כרטיס (פונקציית עזר)
  const handleLikeOrUnlike = async (cardId: string) => {
    const success = await likeOrUnLikeCard(cardId, token);
    if (success && user) {
      setCards((prevCards) => {
        return prevCards.map((card) => {
          if (card._id === cardId) {
            const isLiked = card.likes.includes(user._id + "");
            const newLikes = isLiked
              ? card.likes.filter((like) => like !== user._id + "")
              : [...card.likes, user._id + ""];
            return { ...card, likes: newLikes };
          }
          return card;
        });
      });
    }
  };

  // מחיקת כרטיס (פונקציית עזר)
  const handleDeleteCard = async (cardId: string) => {
    const success = await deleteCard(cardId, token);
    if (success) {
      setCards((prev) => prev.filter((card) => card._id !== cardId));
    }
  };

  // סינון כרטיסים לפי מחרוזות חיפוש (פונקציית עזר)
  const filteredCards = filterBySearch(cards, searchWord);

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
          {filteredCards.length === 0 ? (
            <p className="mt-4 text-gray-500">
              No cards you created were found.
            </p>
          ) : (
            filteredCards.map((card) => {
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
                            onClick={() => handleDeleteCard(card._id)}
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
                          onClick={() => handleLikeOrUnlike(card._id)}
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
          likeOrUnLikeCard={handleLikeOrUnlike}
        />
      </div>
    </>
  );
};
export default MyCards;
