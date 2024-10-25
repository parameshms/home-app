import axios from "axios";

const TRAVEL_TRANSIT_URL = process.env.REACT_APP_TRAVEL_TRANSIT_URL;
const travelAndTransitRequestApi = async (payload, hotel_name) => {
    try {
      const response = await axios.post(
        `${TRAVEL_TRANSIT_URL}/travel/request/add?hotel_name=${hotel_name}`,
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
  
  export { travelAndTransitRequestApi };