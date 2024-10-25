import { useEffect, useState } from "react";
import leftArrowIcon from "../../assests/leftArrow.svg";
import Modal from "../Modal";
import { Link } from "react-router-dom";
import LottieAnimation from "../../constants/LottieAnimation";
import sentRequestLottieJson from "../LottieFiles/sentRequestLottie.json";
import { extraServiceRequestApi, extraServicerequestTypesApi } from "../../apis/extraServicesApi";
import { setExtraServiceData } from "../../constants/extraServicesSlice";
import { useDispatch, useSelector } from "react-redux";

const ExtraServicesPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showLottie, setShowLottie] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const hotel_name = localStorage.getItem("hotel_name");
  const room_no = localStorage.getItem("room_no");
  const rhid = localStorage.getItem("rhid");
  const dispatch = useDispatch();
  const serviceType = useSelector(
    (store) => store.extraServiceItems.serviceType
  );
  console.log(serviceType, "Service Type");

  useEffect(() => {
    const fetchData = async (hotel_name) => {
      try {
        const data = await extraServicerequestTypesApi(hotel_name);
        dispatch(setExtraServiceData(data));
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    };
    fetchData(hotel_name);
  }, [hotel_name, dispatch]);

  const requestAdd = async (requestId) => {
    const payload = {
      rhid: rhid,
      roomNo: room_no,
      requestId: requestId,
      hotel_name: hotel_name,
    };
    console.log(payload, "Extra Services");
    try {
      await extraServiceRequestApi(payload, hotel_name);
    } catch (error) {
      console.error("Error sending request:", error);
      throw error;
    }
  };

  const handleBackButtonClick = () => {
    window.history.back();
  };

  const handleSendRequest = async () => {
    try {
      await requestAdd(selectedServiceId);
      setShowModal(false);
      setShowLottie(true);
      setTimeout(() => {
        setShowLottie(false);
        // window.history.back();
      }, 2000);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Failed to send the request. Please try again.");
      setShowModal(false);
    }
  };

  const openModal = (serviceId) => {
    setShowModal(true);
    setSelectedServiceId(serviceId);
  };

  const handleCancelRequest = () => {
    setShowModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center font-poppins fixed w-full">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-6 p-2">
        <div className="min-h-full font-poppins tracking-wide flex gap-6 p-2 px-3 justify-between mb-4">
          <div className="flex gap-4">
            <img
              src={leftArrowIcon}
              alt=""
              onClick={() => handleBackButtonClick()}
            />
            <h2 className="font-semibold text-[18px] w-full">Extra Services</h2>
          </div>
          <Link to="/checkout/roomSummary">
            <button>SKIP</button>
          </Link>
        </div>

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}

        <div className="h-screen overflow-auto">
          {serviceType?.map((type, typeId) => (
            <div className="flex justify-between items-start p-3" key={typeId}>
              <div className="flex flex-col">
                <div className="text-[14px] font-[600]">{type?.name}</div>
                <div className="w-52 text-[12px]">{type?.description}</div>
              </div>
              <button
                className="flex justify-center items-center border-[1px] outline-none rounded-md text-[13px] font-medium p-2 bg-[#3D6464] px-4 w-24 h-8 mt-1"
                onClick={() => openModal(type?._id)}
              >
                <div className="text-white">Request</div>
              </button>
            </div>
          ))}
        </div>
      </div>
      <Link to="/checkout/roomSummary">
        <div className="fixed bottom-6 left-4 mr-4 z-10 bg-[#3D6464] text-white px-4 py-2 w-96 text-center border rounded-lg">
          <div className="text-[16px] font-medium tracking-wider">
            Get My Final Bill
          </div>
        </div>
      </Link>

      <Modal
        isOpen={showModal}
        closeModal={closeModal}
        handleCancelRequest={handleCancelRequest}
        handleSendRequest={handleSendRequest}
      />

      {showLottie && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-75 z-50">
          <LottieAnimation
            lottieJson={sentRequestLottieJson}
            width="200px"
            height="200px"
          />
        </div>
      )}
    </div>
  );
};

export default ExtraServicesPage;
