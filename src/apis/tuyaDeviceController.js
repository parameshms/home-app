import axios from "axios";

const DEVICE_CONTROL_URL = process.env.REACT_APP_DEVICE_CONTROL_URL;
const generateAccessToken = async () => {
  let payload = {
    suid: "Y84vnprE1n/w9OryOawQZw==",
    email: "parameshmsd123@gmail.com",
    verified: true,
  };
  try {
    const response = await axios.post(
      "https://users.rusehome.net/user-reg",
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

// const tuyaDeviceController = async (payload, token) => {
//   try {
//     const response = await axios.post(
//       `https://control.rusehome.net/tuya_control_devices?token=${token}&device_id=d7777f285d6852d9019c74`,
//       payload,
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     throw error;
//   }
// };

const tuyaDeviceController = async (payload) => {
  try {
    const response = await axios.post(
      `${DEVICE_CONTROL_URL}/control/devices`,
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

export { tuyaDeviceController, generateAccessToken };
