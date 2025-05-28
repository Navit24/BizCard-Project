import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "flowbite-react";
import { FaHeart, FaPhone } from "react-icons/fa";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import type { TRootState } from "../../store/store";
import type { TCard } from "../../types/TCard";
import CardDetails from "../../components/CardDetails";

const Favorites = () => {
  const [cards, setCards] = useState<TCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<TCard | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const searchWord = useSelector(
    (state: TRootState) => state.searchSlice.searchWord,
  );
  const user = useSelector((state: TRootState) => state.userSlice.user);
  const filterBySearch = () => {
    return cards.filter((card: TCard) => {
      return (
        card.title.toLowerCase().includes(searchWord.toLowerCase()) ||
        card.subtitle.toLowerCase().includes(searchWord.toLowerCase()) ||
        card.phone.toLowerCase().includes(searchWord.toLowerCase()) ||
        card.description.toLowerCase().includes(searchWord.toLowerCase())
      );
    });
  };
  const getFavCards = async () => {
    try {
      const response = await axios.get(
        "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards",
      );
      console.log("Response", response.data);
      const likedCards = response.data.filter((item: TCard) => {
        return item.likes.includes(user?._id + "");
      });
      setCards(likedCards);
    } catch (error) {
      console.log("Error fetching cards:", error);
    }
  };
  useEffect(() => {
    if (user?._id) {
      getFavCards();
    }
  }, [user?._id]);
  const likeOrUnLikeCard = async (cardId: string) => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["x-auth-token"] = token;
      await axios.patch(
        `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${cardId}`,
      );
      const card = cards.find((card) => card._id === cardId);
      if (card) {
        const isLiked = card.likes.includes(user?._id + "");
        const cardsArr = [...cards];
        if (isLiked) {
          card.likes = card?.likes.filter((like) => like !== user?._id + "");
          const cardIndex = cardsArr.findIndex((card) => card._id === cardId);
          cardsArr[cardIndex] = card;
          console.log("Succes");
        } else {
          card.likes = [...card.likes, user?._id + ""];
          const cardIndex = cardsArr.findIndex((card) => card._id === cardId);
          cardsArr[cardIndex] = card;
          console.log("Succes");
        }
        setCards(cardsArr);
      }
    } catch (error) {
      console.log("Error liking/unliking card:", error);
    }
  };
  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-4 bg-gray-50 dark:bg-gray-900">
        {cards &&
          filterBySearch().map((card) => {
            const isLiked = card.likes.includes(user?._id + "");
            return (
              <Card
                className="w-80 border-2 border-blue-600 bg-white shadow-md transition-shadow hover:shadow-xl [&>img]:max-h-48 [&>img]:max-w-full"
                imgAlt={card.image.alt}
                imgSrc={card.image.url}
                key={card._id}
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
                </p>{" "}
                <div className="flex justify-start">
                  <button
                    onClick={() => {
                      setSelectedCard(card);
                      setOpenModal(true);
                    }}
                    className="flex items-center gap-1 rounded-md bg-blue-100 px-2 py-1 text-sm font-medium text-blue-600 transition-transform duration-200 hover:scale-105 hover:bg-blue-200"
                  >
                    Click to see more
                    <span className="text-sm">→</span>
                  </button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex gap-4">
                    <MdDelete className="cursor-pointer text-2xl text-blue-600 hover:scale-110" />
                    <MdModeEdit className="cursor-pointer text-2xl text-blue-600 hover:scale-110" />
                  </div>

                  <div className="flex gap-4">
                    {" "}
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
          })}
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
