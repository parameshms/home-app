import React, { useState, useEffect } from "react";
import leftArrowIcon from "../assests/leftArrow.svg";
import lightIcon from "../assests/lightIcon.svg";
import { useNavigate } from "react-router-dom";

const RoomControls = () => {
  const [roles, setRoles] = useState([]); 
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchRoles(); 
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5051/househelp/categories/all"); 
      const data = await response.json(); 
      setRoles(data); 
      console.log(data); 
    } catch (error) {
      console.error("Error fetching roles:", error); 
    }
  };

  const handleRoleClick = (role) => {
    navigate(`/househelp/${role}`); 
  };

  const handleBackButtonClick = () => {
    window.history.back(); 
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center font-poppins scroll-auto">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-6 p-2">
        <div className="min-h-full font-poppins tracking-wide flex gap-5 p-2">
          <img src={leftArrowIcon} alt="Back" onClick={handleBackButtonClick} />
          <h2 className="font-semibold text-[18px]">My home house helps</h2>
        </div>

        <div>
          
          {roles.map((role) => (
            <div
              key={role._id} 
              className="border-[1px] outline-none rounded-full text-center text-[13px] font-medium p-2 m-2"
              onClick={() => handleRoleClick(role.category_name)} 
            >
              <label className="flex justify-between items-center cursor-pointer">
                <div className="flex gap-4 items-center">
                  <img src={lightIcon} alt={role.category_name} />
                  <span className="text-[14px] font-medium">{role.category_name}</span>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomControls;
