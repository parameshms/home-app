import axios from "axios";

const TOKEN_API_URL = process.env.REACT_APP_TOKEN_API_URL;
const REACT_APP_REQUEST_URL = process.env.REACT_APP_REQUEST_URL;
const token = localStorage.getItem("token");
const requestTypesApi = async (hotel_name, serviceName) => {
  try {
    const response = await fetch(
      `${REACT_APP_REQUEST_URL}/services?hotel_name=${hotel_name}&serviceName=${serviceName}`,
      // {
      //   headers: {
      //     Authorization: `Bearer ${token}`, 
      //     "Content-Type": "application/json", 
      //   },
      // }
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

const newRequestApi = async (payload, hotel_name) => {
  try {
    const response = await axios.post(
      `${REACT_APP_REQUEST_URL}/requests/add?hotel_name=${hotel_name}`,
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

const allRequestApi = async (payload, hotel_name) => {
  try {
    const response = await axios.post(
      `${REACT_APP_REQUEST_URL}/orders/myorders?hotel_name=${hotel_name}`,
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

export { requestTypesApi, newRequestApi, allRequestApi };
