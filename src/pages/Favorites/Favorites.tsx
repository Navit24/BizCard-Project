import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Spinner } from "flowbite-react";
import { FaHeart, FaPhone } from "react-icons/fa";
import { useSelector } from "react-redux";
import type { TRootState } from "../../store/store";
import type { TCard } from "../../types/TCard";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  deleteCard,
  likeOrUnLikeCard,
  filterBySearch,
} from "../../utils/cardUtils";
import CardDetails from "../../components/cards/CardDetails";

const Favorites = () => {
  const [cards, setCards] = useState<TCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<TCard | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const searchWord = useSelector(
    (state: TRootState) => state.searchSlice.searchWord,
  );
  const user = useSelector((state: TRootState) => state.userSlice.user);
  const token = localStorage.getItem("token");

  // שליפת כרטיסים מועדפים מהשרת בעת טעינת הדף
  const getFavoriteCards = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards",
      );
      const likedCards = response.data.filter((card: TCard) =>
        card.likes.includes(user?._id + ""),
      );
      setCards(likedCards);
    } catch (error) {
      console.log("Error fetching cards:", error);
    } finally {
      setLoading(false);
    }
  };

  // שליפה ברגע שהמשתמש טוען
  useEffect(() => {
    if (user?._id) {
      getFavoriteCards();
    }
  }, [user?._id]);

  // לייק או הסרת לייק על כרטיס (פונקציית עזר)
  const handleLikeOrUnlike = async (cardId: string) => {
    const success = await likeOrUnLikeCard(cardId, token);
    if (success && user) {
      setCards((prevCards) => {
        return prevCards.filter((card) => {
          const isLiked = card.likes.includes(user._id);
          if (card._id === cardId && isLiked) {
            return false;
          }
          return true;
        });
      });
    }
  };

  //  (פונקציית עזר) מחיקת כרטיס
  const handleDeleteCard = async (cardId: string) => {
    const success = await deleteCard(cardId, token);
    if (success) {
      setCards((prev) => prev.filter((card) => card._id !== cardId));
    }
  };

  // (פונקציית עזר) סינון כרטיסים לפי מחרוזות חיפוש
  const filteredCards = filterBySearch(cards, searchWord);
  return (
    <>
      <div className="p-4 dark:bg-gray-900">
        {/* כותרות */}
        <div className="bg m-8 flex flex-col items-center text-gray-900">
          <h4 className="text-4xl font-bold dark:text-white">
            Favorite Cards Pages
          </h4>
          <h5 className="mt-2 text-xl font-normal text-gray-700 dark:text-white">
            Here you can find all your Favorite business cards
          </h5>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 p-4">
          {loading ? (
            <Spinner aria-label="Default status example" />
          ) : cards.length === 0 ? (
            <p className="mt-4 text-gray-500"> No favorite cards found.</p>
          ) : (
            filteredCards.map((card) => {
              const isLiked = card.likes.includes(user?._id + "");
              return (
                <Card
                  key={card._id}
                  className="w-80 border-2 border-blue-600 bg-white shadow-md transition-shadow hover:shadow-xl [&>img]:max-h-48 [&>img]:max-w-full"
                  imgAlt={card.image.alt}
                  imgSrc={card.image.url}
                >
                  <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {card.title}
                  </h5>
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    {card.subtitle}
                  </p>
                  <hr className="border-gray-300" />
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    <b>Phone:</b> {card.phone}
                  </p>
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    <b>Address:</b> {card.address.street}
                    {card.address.houseNumber} {card.address.city}
                    {card.address.country}
                  </p>
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    <b>Card Number:</b> {card.bizNumber}
                  </p>

                  {/* כפתור לפרטים נוספים */}
                  <div className="flex justify-start">
                    <button
                      onClick={() => {
                        setSelectedCard(card);
                        setOpenModal(true);
                      }}
                      className="flex items-center gap-1 rounded-md bg-blue-100 px-2 py-1 text-sm font-medium text-blue-600 transition-transform duration-200 hover:scale-105 hover:bg-blue-200"
                    >
                      Click to see more →
                    </button>
                  </div>

                  {/* אייקונים */}
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

                      <FaHeart
                        className={`${isLiked ? "text-red-500" : "text-blue-400"} cursor-pointer text-xl hover:scale-110`}
                        onClick={() => handleLikeOrUnlike(card._id)}
                      />
                    </div>
                  </div>
                </Card>
              );
            })
          )}
          {/* קומפוננטת מודל לפרטי כרטיס */}
          <CardDetails
            open={openModal}
            onClose={() => setOpenModal(false)}
            card={selectedCard}
            likeOrUnLikeCard={handleLikeOrUnlike}
          />
        </div>
      </div>
    </>
  );
};
export default Favorites;
