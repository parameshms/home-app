import axios from "axios";
const FOOD_API_URL = process.env.REACT_APP_FOOD_ORDER_URL;
const token = localStorage.getItem("token");
const inRoomDiningMenuApi = async () => {
  try {
    const response = await fetch(
      `${FOOD_API_URL}/food/menu`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    console.log(result, "Result")
    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const placeFoodOrderApi = async (payload) => {
  try {
    const response = await axios.post(
      `${FOOD_API_URL}/food/order`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export { inRoomDiningMenuApi, placeFoodOrderApi };
