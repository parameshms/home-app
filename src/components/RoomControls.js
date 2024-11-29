import React, { useState, useEffect } from "react";
import leftArrowIcon from "../assests/leftArrow.svg";
import lightIcon from "../assests/lightIcon.svg";
import { useNavigate } from "react-router-dom";
import maid from '../assests/maid.png'
import fulltime from '../assests/fulltime.png'
import caretaker from '../assests/babysitter.png'
import nanny from '../assests/nanny.png'
import gardener from '../assests/gardener.png'
import watchman from '../assests/watchman.png'
import housekeeper from '../assests/housekeeeper.png'
import laundryman from '../assests/laundry.png'
import petsetter from '../assests/dog.png'
import chauffeur from '../assests/chauffeur.png'
import carcleaner from '../assests/carcleaner.png'
import defaultImage from '../assests/maid.png'
import driver from '../assests/driver.png'
import cook from '../assests/cook.png'

const API = process.env.REACT_APP_API;


const RoomControls = () => {
  const [roles, setRoles] = useState([]);
  const [househelps, setHousehelps] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchHousehelps();
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${API}/househelp/categories/all`);
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchHousehelps = async () => {
    try {
      const response = await fetch(`${API}/househelp/cat`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setHousehelps(data.categories || []);
    } catch (error) {
      console.error("Error fetching househelps:", error);
    }
  };

  const handleRoleClick = (role) => {
    navigate(`/househelp/${role}`);
  };

  const handleBackButtonClick = () => {
    window.history.back();
  };

  const handleAddHousehelpClick = () => {
    navigate("/addHouseHelps");
  };

  // Filter roles that are not yet added as househelps
  const availableRoles = roles.filter(
    (role) => !househelps.some((househelp) => househelp.category_id === role._id)
  );


  const roleImageMapping = {
    "maid": maid,       
    "Cook": cook,      
    "Driver": driver,  
    "Full-time Worker":fulltime,
    "Caretaker":caretaker,
    "Nanny":nanny,
    "Gardener":gardener,
    "Watchman":watchman,
    "Housekeeper":housekeeper,
    "Laundryman":laundryman,
    "Pet-sitter":petsetter,
    "Chauffeur":chauffeur,
    "Car Cleaner":carcleaner,
    
  };
  
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center font-poppins scroll-auto">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-6 p-2">
        <div className="min-h-full font-poppins tracking-wide flex gap-5 p-2">
          <img 
            src={leftArrowIcon} 
            alt="" 
            onClick={() => handleBackButtonClick()} 
            className="w-10 h-10 cursor-pointer" 
          />
          <h2 className="font-semibold text-[18px]">My home house helps</h2>
        </div>
  
        <div>
          {househelps.length > 0 ? (
            househelps.map((househelp) => {
             
              const roleImage = roleImageMapping[househelp.category_name] || defaultImage; 
  
              return (
                <div
                  key={househelp._id}
                  className="border-[1px] outline-none rounded-full text-center text-[13px] font-medium p-2 m-2"
                  onClick={() => handleRoleClick(househelp.category_name)}
                >
                  <label className="flex justify-between items-center cursor-pointer">
                    <div className="flex gap-4 items-center">
                      <img src={roleImage} alt={househelp.category_name} className="w-8 h-8" />
                      <span className="text-[14px] font-medium">{househelp.category_name}</span>
                    </div>
                  </label>
                </div>
              );
            })
          ) : (
            <p>No househelps found</p>
          )}
  
          {availableRoles.length > 0 && (
            <div>
              <button
                onClick={handleAddHousehelpClick}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
              >
                Add Househelp
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
};

export default RoomControls;
