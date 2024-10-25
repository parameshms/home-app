import React, { useEffect, useState } from "react";
import leftArrowIcon from "../../assests/leftArrow.svg";
import Modal from "../Modal";
import {
  newRequestApi,
  requestTypesApi,
} from "../../apis/requestApi";
import { travelAndTransitRequestApi } from "../../apis/travelAndTransitApi";

const TravelAndTransitPage = () => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [serviceType, setServiceType] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const rhid = localStorage.getItem("rhid");
  const room_no = localStorage.getItem("room_no");
  const hotel_name = localStorage.getItem("hotel_name");

  useEffect(() => {
    requestType();
  }, []);

  const handleBackButtonClick = () => {
    window.history.back();
  };

  const handleSendRequest = async () => {
    await requestAdd(selectedServiceId);
    setShowModal(false);
    window.history.back();
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

  const requestType = async () => {
    try {
      const data = await requestTypesApi(hotel_name, "travel");
      setServiceType(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  console.log(serviceType, "ServiceType");
  const requestAdd = async (requestId) => {
    const payload = {
      rhid: rhid,
      requestId: requestId,
    };
    try {
      await travelAndTransitRequestApi(payload, hotel_name);
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center font-poppins">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-6 p-2">
        <div className="min-h-full font-poppins tracking-wide flex gap-6 p-2">
          <img
            src={leftArrowIcon}
            alt=""
            onClick={() => handleBackButtonClick()}
          />
          <h2 className="font-semibold text-[18px]">Travel & Transit</h2>
        </div>
        <div className="p-2 m-2 mt-3">
          <div className="mb-1 text-[16px] font-normal text-gray-400">
            Book Travel
          </div>
          <div className="h-screen overflow-auto">
            {serviceType?.map((serviceData, serviceDataIdx) => {
              return (
                <div
                  className="flex justify-between items-start py-4"
                  key={serviceDataIdx}
                >
                  <div className="flex flex-col gap-2">
                    <div className="text-[14px] font-[600]">
                      {serviceData?.name}
                    </div>
                    <div className="w-52 text-[12px]">
                      {serviceData?.description}
                    </div>
                    <div className="text-[12px] font-semibold">
                      *Additional Charges
                    </div>
                  </div>
                  <button className="flex justify-center items-center border-[1px] outline-none rounded-xl text-[13px] font-medium p-2  bg-[#3D6464] px-4 w-24 h-8 mt-1">
                    <div
                      className="text-white"
                      onClick={() => openModal(serviceData?._id)}
                    >
                      Request
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Modal
        isOpen={showModal}
        closeModal={closeModal}
        handleCancelRequest={handleCancelRequest}
        handleSendRequest={handleSendRequest}
      />
    </div>
  );
};

export default TravelAndTransitPage;
