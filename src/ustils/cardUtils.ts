import axios from "axios";
import Swal from "sweetalert2";
import type { TCard } from "../types/TCard";

// פוקציה כללית למחיקת כרטיס מהשרת
export const deleteCard = async (cardId: string, token: string | null) => {
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
    return true;
  } catch (error) {
    Swal.fire("error", "The card could not be deleted.", "error");
    return false;
  }
};

// פונקציה כללית לליק או הסרת לייק על כרטיס
export const likeOrUnLikeCard = async (
  cardId: string,
  token: string | null,
) => {
  if (!token) return false;
  try {
    await axios.patch(
      `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${cardId}`,
      {},
      { headers: { "x-auth-token": token } },
    );
    return true;
  } catch (error) {
    console.log("Error liking/unliking card:", error);
    Swal.fire("error", "Could not update like", "error");
    return false;
  }
};

// סינון כרטיסים לפי מחרוזות חיפוש
export const filterBySearch = (cards: TCard[], searchWord: string): TCard[] => {
  return cards.filter((card) => {
    return (
      card.title.toLowerCase().includes(searchWord.toLowerCase()) ||
      card.subtitle.toLowerCase().includes(searchWord.toLowerCase()) ||
      card.phone.toLowerCase().includes(searchWord.toLowerCase()) ||
      card.description.toLowerCase().includes(searchWord.toLowerCase())
    );
  });
};
