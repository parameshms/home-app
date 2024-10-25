import axios from "axios";

const HOUSEKEEPLING_URL = process.env.REACT_APP_HOUSEKEEPING_URL;
const housekeepingRequestApi = async (payload, hotel_name) => {
  try {
    const response = await axios.post(
      `${HOUSEKEEPLING_URL}/housekeeping/request/add?hotel_name=${hotel_name}`,
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

export { housekeepingRequestApi };
