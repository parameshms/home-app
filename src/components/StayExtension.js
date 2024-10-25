import React, { useState } from "react";
import leftArrowIcon from "../assests/leftArrow.svg";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { Link } from "react-router-dom";

const StayExtension = () => {
  const [date, setDate] = useState({
    startDate: new Date(),
    endDate: new Date(), // or null depending on your requirement
    key: "selection",
  });

  const [isDateSelected, setIsDateSelected] = useState(false);
  const [reason, setReason] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleBackButtonClick = () => {
    window.history.back();
  };

  const handleSelect = (ranges) => {
    const { selection } = ranges;
    setDate(selection);
    setIsDateSelected(true);
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleSubmit = () => {
    // Here you can perform your form submission logic
    // For demonstration, let's just set a success message
    setSuccessMessage("Stay extension request submitted successfully!");
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center font-poppins scroll-auto">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-6 p-4">
        <div className="min-h-full font-poppins tracking-wide flex gap-5">
          <img src={leftArrowIcon} alt="Back" onClick={handleBackButtonClick} />
          <h2 className="font-semibold text-[18px]">Extend My Stay</h2>
        </div>
        <div className="flex gap-4 my-6 text-[14px]">
          <span className="font-semibold">Previous Checkout Date :</span>
          <span className="font-bold">14 Jun, Fri</span>
        </div>
        <div className="flex gap-4 my-6 text-[14px] font-semibold">
          New Checkout Date :
        </div>
        <div className="flex justify-center items-center">
          <DateRange
            onChange={handleSelect}
            minDate={new Date()}
            editableDateInputs={true}
            moveRangeOnFirstSelection={false}
            ranges={[date]}
            rangeColors={["#3D6464"]}
            className="flex item-center justify-center"
          />
        </div>
        <div className="flex gap-4 my-6 text-[14px] font-semibold">
          Reason for extension
        </div>
        <textarea
          placeholder="Please provide some information here..."
          className="p-4 h-32 w-full bg-gray-100 text-black placeholder:text-gray-400 outline-none my-2"
          value={reason}
          onChange={handleReasonChange}
        />
        <div
          className="border-[1px] outline-none rounded-xl text-center text-[16px] font-medium p-2 flex justify-center items-center bg-[#3D6464] py-3 cursor-pointer"
          onClick={handleSubmit}
        >
          <div className="text-white">Submit Request</div>
        </div>
        {successMessage && (
          <div className="text-green-500 mt-4 text-center">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default StayExtension;
