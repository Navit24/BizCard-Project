import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Pagination } from "flowbite-react";
import { FaHeart, FaPhone } from "react-icons/fa";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import type { TRootState } from "../../store/store";
import CardDetails from "../../components/CardDetails";
import type { TCard } from "../../types/TCard";
import { IoCreateOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<TCard[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const onPageChange = (page: number) => setCurrentPage(page);
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

  const getAllCards = async () => {
    try {
      const response = await axios.get(
        "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards",
      );
      console.log("Response", response.data);

      setCards(response.data);
    } catch (error) {
      console.log("Error fetching cards:", error);
    }
  };
  useEffect(() => {
    getAllCards();
  }, []);

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
      <div className="flex flex-wrap items-center justify-center gap-4 p-4 dark:bg-gray-900">
        {user && user.isBusiness && (
          <Button
            onClick={() => {
              navigate("/create-card");
            }}
            className="fixed right-0 bottom-7 h-14 w-16 rounded-l-full bg-blue-600 text-2xl hover:bg-blue-700"
          >
            <IoCreateOutline />
          </Button>
        )}
        {cards &&
          filterBySearch().map((card) => {
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
      <div className="my-5 flex overflow-x-auto sm:justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={100}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
};
export default Home;
