import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Pagination, Spinner } from "flowbite-react";
import { FaHeart, FaPhone } from "react-icons/fa";
import { useSelector } from "react-redux";
import type { TRootState } from "../../store/store";
import CardDetails from "../../components/CardDetails";
import type { TCard } from "../../types/TCard";
import { IoCreateOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<TCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<TCard | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchWord = useSelector(
    (state: TRootState) => state.searchSlice.searchWord,
  );
  const user = useSelector((state: TRootState) => state.userSlice.user);
  const token = localStorage.getItem("token");

  // הבאת כל הכרטיסים מהשרת
  const getAllCards = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards",
      );
      setCards(response.data);
    } catch (error) {
      console.log("Error fetching cards:", error);
    } finally {
      setLoading(false);
    }
  };

  // לייק או הסרת לייק על כרטיס
  const likeOrUnLikeCard = async (cardId: string) => {
    if (!token || !user) return;
    try {
      await axios.patch(
        `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${cardId}`,
        {},
        { headers: { "x-auth-token": token } },
      );

      setCards((prevCards) => {
        return prevCards.map((card) => {
          if (card._id === cardId) {
            const isLiked = card.likes.includes(user._id);
            const newLikes = isLiked
              ? card.likes.filter((like) => like !== user._id)
              : [...card.likes, user._id];
            return { ...card, likes: newLikes };
          }
          return card;
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

  // דפדןף
  const [currentPage, setCurrentPage] = useState(1);
  const onPageChange = (page: number) => setCurrentPage(page);
  const cardsPerPage = 12;
  const filteredCards = filterBySearch();
  const currentCards = filteredCards.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage,
  );
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);

  // טעינת הכרטיסים בעת טעינת הקומפוננטה
  useEffect(() => {
    getAllCards();
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-4 p-4 dark:bg-gray-900">
        {/* כפתור ליצירת כרטיס חדש לעסקים */}
        {user?.isBusiness && (
          <Button
            onClick={() => {
              navigate("/create-card");
            }}
            className="fixed right-0 bottom-7 h-14 w-16 rounded-l-full bg-blue-600 text-2xl hover:bg-blue-700"
          >
            <IoCreateOutline />
          </Button>
        )}

        {/* הצגת הכרטיסים המסוננים */}
        {loading ? (
          <Spinner aria-label="Default status example" />
        ) : (
          currentCards.map((card) => {
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
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  {card.subtitle}
                </p>
                <hr className="border-gray-300" />
                <p className="text-gray-700 dark:text-gray-400">
                  <b>Phone:</b> {card.phone}
                </p>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  <b>Address:</b> {card.address.street}{" "}
                  {card.address.houseNumber} {card.address.city}{" "}
                  {card.address.country}
                </p>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  <b>Card Number:</b> {card.bizNumber}
                </p>{" "}
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
                <div className="flex items-center justify-between py-2">
                  <div className="flex gap-4"></div>

                  <div className="flex gap-4">
                    <FaPhone className="cursor-pointer text-xl text-blue-600 hover:scale-110" />
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

        {/* מודל פרטי כרטיס */}
        <CardDetails
          open={openModal}
          onClose={() => setOpenModal(false)}
          card={selectedCard}
          likeOrUnLikeCard={likeOrUnLikeCard}
        />
      </div>

      {/* דפדוף */}
      {!loading && (
        <div className="my-5 flex overflow-x-auto sm:justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            showIcons
          />
        </div>
      )}
    </>
  );
};
export default Home;
