import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import leftArrowIcon from "../assests/leftArrow.svg";
import bulb from "../assests/bulb.jpg";

export default function Reminders() {
  const [reminders, setReminders] = useState(null);

  const API = process.env.REACT_APP_API

  const handleBackButtonClick = () => {
    window.history.back();
  };

  useEffect(() => {
    
    const fetchReminders = async () => {
      try {
        const response = await fetch(`${API}/reminders`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setReminders(data);
      } catch (error) {
        console.error('Error fetching reminders:', error);
      }
    };
    
    fetchReminders();
  }, []);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center font-poppins scroll-auto">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-6 p-2">
        <div className="min-h-full font-poppins tracking-wide flex gap-6 p-2">
          <img
            src={leftArrowIcon}
            alt="Back"
            onClick={handleBackButtonClick}
          />
          <h2 className="font-semibold text-[18px]">Reminders</h2>
        </div>
        <div className="p-2 m-2 mt-3">
          <div className="flex flex-col gap-5">

            {/* Check if reminders data is available */}
            {reminders && (
              <>
                {/* Family Members Approval Reminder */}
                {reminders.family_members_approval > 0 && (
                  <div className="flex justify-between items-center px-9 py-7 pr-12 border-2 shadow-md rounded-xl bg-white hover:bg-[#819b9b]">
                    <div className="text-[18px] font-medium tracking-wider">
                      {reminders.family_members_approval} family members waiting for approval
                    </div>
                  </div>
                )}

                {/* Electricity Bill Due Reminders */}
                {reminders.electricity_due_reminders.length > 0 && (
                  reminders.electricity_due_reminders.map((reminder, index) => (
                    <div key={index} className="flex justify-between items-center px-9 py-7 pr-12 border-2 shadow-md rounded-xl bg-white hover:bg-[#819b9b]">
                      <div className="text-[18px] font-medium tracking-wider">
                        {reminder}
                      </div>
                    </div>
                  ))
                )}

                {/* Groceries Pending Reminder */}
                {reminders.groceries_pending > 0 && (
                  <div className="flex justify-between items-center px-9 py-7 pr-12 border-2 shadow-md rounded-xl bg-white hover:bg-[#819b9b]">
                    <div className="text-[18px] font-medium tracking-wider">
                      {reminders.groceries_pending} groceries items need to be ordered
                    </div>
                  </div>
                )}

                {/* Househelp Pending Payments */}
                {reminders.househelp_pending_payments.length > 0 && (
                  reminders.househelp_pending_payments.map((reminder, index) => (
                    <div key={index} className="flex justify-between items-center px-9 py-7 pr-12 border-2 shadow-md rounded-xl bg-white hover:bg-[#819b9b]">
                      <div className="text-[18px] font-medium tracking-wider">
                        {reminder}
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
