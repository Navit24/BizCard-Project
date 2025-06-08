import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Spinner } from "flowbite-react";
import { FaHeart, FaPhone } from "react-icons/fa";
import { useSelector } from "react-redux";
import type { TRootState } from "../../store/store";
import type { TCard } from "../../types/TCard";
import CardDetails from "../../components/CardDetails";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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

  // שליפת כרטיסים מועדפים מהשרת
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

  // הסרת לייק על כרטיס
  const likeOrUnLikeCard = async (cardId: string) => {
    if (!token || !user) return;
    try {
      await axios.patch(
        `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${cardId}`,
        {},
        { headers: { "x-auth-token": token } },
      );
      setCards((prevCards) => {
        return prevCards.filter((card) => {
          const isLiked = card.likes.includes(user._id);
          if (card._id === cardId && isLiked) {
            return false;
          }
          return true;
        });
      });
    } catch (error) {
      console.log("Error liking/unliking card:", error);
    }
  };

  // סינון כרטיסים לפי מחרוזות חיפוש
  const filterBySearch = () => {
    return cards.filter((card) => {
      return (
        card.title.toLowerCase().includes(searchWord.toLowerCase()) ||
        card.subtitle.toLowerCase().includes(searchWord.toLowerCase()) ||
        card.phone.toLowerCase().includes(searchWord.toLowerCase()) ||
        card.description.toLowerCase().includes(searchWord.toLowerCase())
      );
    });
  };

  // מחיקת כרטיס
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
  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-4 dark:bg-gray-900">
        {loading ? (
          <Spinner aria-label="Default status example" />
        ) : cards.length === 0 ? (
          <p className="mt-4 text-center text-gray-500"> No cards found.</p>
        ) : (
          filterBySearch().map((card) => {
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
                  <b>Address:</b> {card.address.street}{" "}
                  {card.address.houseNumber} {card.address.city}{" "}
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

                    <FaHeart
                      className={`${isLiked ? "text-red-500" : "text-blue-400"} cursor-pointer text-xl hover:scale-110`}
                      onClick={() => likeOrUnLikeCard(card._id)}
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
          likeOrUnLikeCard={likeOrUnLikeCard}
        />
      </div>
    </>
  );
};
export default Favorites;
