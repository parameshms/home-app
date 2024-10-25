import React, { useState } from "react";
const ReserveTable = () => {
  const [reservationDetails, setReservationDetails] = useState({
    date: "",
    time: "",
    guests: "",
  });
  const handleChange = (event) => {
    setReservationDetails({
      ...reservationDetails,
      [event.target.name]: event.target.value,
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
  };
  const today = new Date().toISOString().split("T")[0];
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  return (
    <div className="px-4 py-5">
      {" "}
      <div class="max-w-xs mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        {" "}
        <div className="py-3 px-4 bg-blue-800">
          {" "}
          <h1 className="text-white">Hotel Table Reservation</h1>{" "}
        </div>{" "}
        <form onSubmit={handleSubmit} className="p-4">
          {" "}
          <label className="block">
            {" "}
            <span className="text-gray-700">Date</span>{" "}
            <input
              type="date"
              name="date"
              value={reservationDetails.date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />{" "}
          </label>{" "}
          <label className="block mt-3">
            {" "}
            <span className="text-gray-700">Time</span>{" "}
            <input
              type="time"
              name="time"
              value={reservationDetails.time}
              onChange={handleChange}
              min={today}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />{" "}
          </label>{" "}
          <label className="block mt-3">
            {" "}
            <span className="text-gray-700">Number of Guests</span>{" "}
            <input
              type="number"
              name="guests"
              value={reservationDetails.guests}
              onChange={handleChange}
              min={today}
              max={nextWeek}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />{" "}
          </label>{" "}
          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white tracking-wide text-center py-2 rounded hover:bg-blue-500 transition ease-in-out duration-500"
          >
            Submit Reservation
          </button>{" "}
        </form>{" "}
      </div>{" "}
    </div>
  );
};
export default ReserveTable;
