import axios from "axios";

const MINI_BAR_URL = process.env.REACT_APP_MINI_BAR_URL;
const miniBitesMenuApi = async (hotel_name) => {
  //   const accessToken = localStorage.getItem("ACCESS-TOKEN");

  if (!MINI_BAR_URL) {
    throw new Error("MINI_BAR_URL is not defined");
  }

  try {
    const response = await fetch(
      `${MINI_BAR_URL}/barItems?hotel_name=${hotel_name}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const placeMiniBitesOrderApi = async (payload, hotel_name) => {
  try {
    const response = await axios.post(
      `${MINI_BAR_URL}/barItems/order?hotel_name=${hotel_name}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export { miniBitesMenuApi, placeMiniBitesOrderApi };
