import React from "react";

const ModalHomePage = ({
  isOpen,
  closeModal,
  handleCancelRequest,
  handleSendRequest,
}) => {
  const handleRequest = () => {
    handleSendRequest();
  };
  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "" : "hidden"}`}>
      <div className="flex items-center justify-center min-h-screen bg-gray-800 bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-8 mx-10">
          <span
            className="absolute top-0 right-0 p-3 cursor-pointer"
            onClick={closeModal}
          >
            &times;
          </span>
          <p className="mb-2 flex text-center items-center justify-center text-wrap text-[16px] font-semibold">
            Checkout Request Sent!
          </p>
          <p className="mb-8 flex items-center text-center text-wrap text-[12px] font-normal">
            You checkout request has sent to front desk. We are processing your
            final bill.
          </p>
          <div className="flex flex-col justify-between gap-3 mt-3">
            <button
              className="bg-[#3D6464] hover:bg-red-600 text-white px-4 py-2 rounded-lg text-[12px] font-medium"
              onClick={handleRequest}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalHomePage;
