import axios from "axios";

const AMENITIES_URL = process.env.REACT_APP_AMENITIES_URL;
const amenitiesRequestApi = async (payload, hotel_name) => {
  try {
    const response = await axios.post(
      `${AMENITIES_URL}/amenities/request/add?hotel_name=${hotel_name}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export { amenitiesRequestApi };
