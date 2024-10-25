const liveStatusApi = async (hotel_name) => {
  const TOKEN_API_URL = process.env.REACT_APP_TOKEN_API_URL;
  try {
    const response = await fetch(
      `${TOKEN_API_URL}/livestatus?hotel_name=${hotel_name}`
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

export { liveStatusApi };
