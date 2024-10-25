import { useState } from "react";
import leftArrowIcon from "../../assests/leftArrow.svg";
import ConfirmCheckOutModal from "./ConfirmCheckoutModal";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RoomSummary = () => {
  const [showModal, setShowModal] = useState(false);
  const handleBackButtonClick = () => {
    window.history.back();
  };

  const requestData = useSelector((store) => store.requestItems.requestData);
  const navigate = useNavigate();

  const handleSendRequest = async () => {
    setShowModal(false);
    navigate("stayComplete");
  };

  const openModal = () => {
    setShowModal(true);
  };

  const handleCancelRequest = () => {
    setShowModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const processData = (data) => {
    const orderSummary = {};

    data.forEach((day) => {
      day.orders.forEach((order) => {
        if (!orderSummary[order.orderName]) {
          orderSummary[order.orderName] = {
            count: 0,
            totalPrice: 0,
          };
        }
        orderSummary[order.orderName].count += 1;
        orderSummary[order.orderName].totalPrice += order.totalPrice;
      });
    });

    return orderSummary;
  };

  const orderSummary = processData(requestData);
  const totalAmount = Object.values(orderSummary).reduce(
    (sum, order) => sum + order.totalPrice,
    0
  );

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center font-poppins scroll-auto">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-6">
        <div className="min-h-full font-poppins tracking-wide flex gap-5 p-4">
          <img src={leftArrowIcon} alt="Back" onClick={handleBackButtonClick} />
          <h2 className="font-semibold text-[18px]">Room Summary</h2>
        </div>
        <div className="border-b-2">
          <div className="flex justify-between p-4">
            <div className="flex flex-col justify-start">
              <div className="text-[14px]">Check In</div>
              <div className="font-semibold text-[14px]">8 Jan, Mon</div>
            </div>
            <div className="flex flex-col justify-start">
              <div className="text-[14px]">Check Out</div>
              <div className="font-semibold text-[14px]">9 Jan, Tue</div>
            </div>
          </div>
        </div>
        <div className="my-2 px-4">
          <div className="text-[14px] font-semibold mb-1">
            Your Room Requests
          </div>
          <div className="h-auto overflow-auto flex flex-col gap-2 my-2">
            {Object.entries(orderSummary).map(([orderName, details]) => (
              <div key={orderName} className="text-[13px] flex justify-between">
                <div>
                  {details.count} X {orderName}{" "}
                </div>
                <div>₹ {Math.round(details.totalPrice * 100) / 100}</div>
              </div>
            ))}
          </div>
          <div className="relative border-t-2 py-2 flex flex-col gap-2 w-full">
            <div className="text-[16px] font-semibold flex justify-between">
              <div> Total :</div><div> ₹ {Math.round(totalAmount * 100) / 100}</div>
            </div>
            <div className="text-[12px] font-[500]">
              Based on requested check out on Jan 09,2024 at 01:45 PM
            </div>
            <div className="text-[14px] font-[550] leading-5">
              For assistance, please contact the front desk.
            </div>
          </div>
        </div>

        <div
          className="fixed bottom-6 left-4 mr-4 z-10 bg-[#3D6464] text-white px-4 py-2 w-96 text-center border rounded-lg"
          onClick={openModal}
        >
          <div className="text-[16px] font-medium tracking-wider">
            Confirm CheckOut
          </div>
        </div>
      </div>
      {/* <AmenitiesOrder /> */}
      <ConfirmCheckOutModal
        isOpen={showModal}
        closeModal={closeModal}
        handleCancelRequest={handleCancelRequest}
        handleSendRequest={handleSendRequest}
      />
    </div>
  );
};

export default RoomSummary;
