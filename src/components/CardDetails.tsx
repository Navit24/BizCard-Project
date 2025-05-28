// import { useEffect , useState} from "react";
import type { TCard } from "../types/TCard";
// import { useParams } from "react-router-dom";
// import axios from "axios";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { FaHeart, FaPhone } from "react-icons/fa";
import { Card, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { useSelector } from "react-redux";
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
  const isLiked = card?.likes.includes(user?._id + "");
  //   const [card, setCard] = useState<TCard>();
  //   const { id } = useParams<{ id: string }>();

  //   useEffect(() => {
  //     const getCardByID = async () => {
  //       try {
  //         const response = await axios.get(
  //           `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${id}`,
  //         );

  //         setCard(response.data);
  //       } catch (error) {
  //         console.error("Error getting card details:", error);
  //       }
  //     };
  //     getCardByID();
  //   }, [id]);

  return (
    <>
      <Modal show={open} onClose={onClose}>
        <ModalHeader className="border-gray-300">Card details</ModalHeader>
        <ModalBody>
          <div className="flex flex-wrap items-center justify-center dark:bg-gray-900">
            {card && (
              <Card
                className="m-5 w-full border-2 bg-white shadow-md transition-shadow hover:shadow-xl [&>img]:max-h-48 [&>img]:max-w-full"
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
                  <b>Description:</b> {card.description}
                </p>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  <b>Phone:</b> {card.phone}
                </p>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  <b>Web:</b> {card.web}
                </p>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  <b>Address:</b> {card.address.street}{" "}
                  {card.address.houseNumber} {card.address.city}{" "}
                  {card.address.country}
                </p>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  <b>Card Number:</b> {card.bizNumber}
                </p>{" "}
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
            )}
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};
export default CardDetails;
