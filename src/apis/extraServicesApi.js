import axios from "axios";

const REACT_APP_REQUEST_URL = process.env.REACT_APP_REQUEST_URL;
const extraServicerequestTypesApi = async (hotel_name) => {
  try {
    const response = await fetch(
      `${REACT_APP_REQUEST_URL}/extraServices?hotel_name=${hotel_name}`
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

const extraServiceRequestApi = async (payload, hotel_name) => {
  try {
    const response = await axios.post(
      `${REACT_APP_REQUEST_URL}/extraServices/add?hotel_name=${hotel_name}`,
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

export { extraServicerequestTypesApi, extraServiceRequestApi };
