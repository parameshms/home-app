
import roomImg from "../assests/roomImg.png";
import rightArrowImg from "../assests/rightArrow.svg";
import houseKeepingIcon from "../assests/houseKeepingIcon.svg";
import miniBitesIcon from "../assests/miniBitesIcon.svg";
import requestBoxIcon from "../assests/requestBoxIcon.svg";
import foodIcon from "../assests/foodIcon.svg";
import deviceControlIcon from "../assests/deviceControlIcon.svg";
import mic from "../assests/mic.png";
import io from 'socket.io-client';
import axios from 'axios'; 

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import ModalHomePage from "./ModalHomePage";


const HomePage = () => {

  const [showModal, setShowModal] = useState(false);
  const [output, setOutput] = useState("");
  const [socket, setSocket] = useState(null);
  const [homeDetails, setHomeDetails] = useState({}); 
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  
  console.log(output);

  useEffect(() => {
    const fetchHomeDetails = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:1212/home', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setHomeDetails(response.data); 
      } catch (error) {
        console.error("Error fetching home details:", error);
      }
    };

    fetchHomeDetails();
  }, [token]);

  useEffect(() => {
    const newSocket = io(`http://127.0.0.1:8080`);
    setSocket(newSocket);

    newSocket.on('update', (data) => {
        const formattedMessage = JSON.stringify(data.message, null, 2);
        setOutput((prevOutput) => prevOutput + formattedMessage + '\n');
    });

    return () => {
        newSocket.close();
    };
  }, []);

  const handleVoice = () => {
    setOutput(""); 
    fetch('http://127.0.0.1:8080/start-main', { 
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  };

  const splitOutput = output.trim().split('\n');

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center font-poppins scroll-auto">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-0 p-2">
        <div className="min-h-full font-poppins tracking-wide flex flex-col gap-2 p-2">
          <div className="flex justify-between items-start mt-4">
            <h2 className="font-semibold text-[18px]">My Home</h2>
          </div>
          <div className="font-medium text-[16px]">
            Hello, {username}
          </div>
          <div className="font-medium text-[16px]">
           You are currently staying in
          </div>
          <div className="grid grid-flow-row border-[1px] rounded-xl">
            <div className="grid grid-cols-2 border-b">
              <div className="w-[189px] h-[189px]">
                <img
                  src={roomImg}
                  alt=""
                  className="rounded-l-xl col-span-1 w-[189px] h-[189px] object-cover object-center"
                />
              </div>
              <div className="flex flex-col">
                <div className="mt-2 px-2 col-span-1 flex flex-col justify-center border-b h-1/2">
                
                  <div className="font-semibold text-[14px] ml-2">
                    Flat No {homeDetails.flat}
                  </div>
                  <div className="font-light text-[14px] ml-2">
                    {homeDetails.name}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Link to="/househelps">
              <div className="col-span-1 flex flex-col justify-center items-center px-3 border rounded-xl bg-white hover:bg-[#819b9b] gap-4 pb-4">
                <img src={deviceControlIcon} alt="" className="w-10 h-10 " />
                <div className="text-sm font-base">Household Management</div>
              </div>
            </Link>
            <Link to="/orderFood">
              <div className="col-span-1 flex flex-col justify-center items-center px-3 pt-2 border rounded-xl bg-white hover:bg-[#819b9b] gap-4 pb-4">
                <img src={foodIcon} alt="" className="w-8 h-8 " />
                <div className="text-sm font-base">Order Food</div>
              </div>
            </Link>
            <Link to="/electricity">
              <div className="col-span-1 flex flex-col justify-center items-center px-3 pt-2 border rounded-xl bg-white hover:bg-[#819b9b] gap-4 pb-4">
                <img src={houseKeepingIcon} alt="" className="w-8 h-8 " />
                <div className="text-sm font-base">Electricity</div>
              </div>
            </Link>
            <Link to="/groceries/out_of_stock">
              <div className="col-span-1 flex flex-col justify-center items-center px-3 pt-2 border rounded-xl bg-white hover:bg-[#819b9b] gap-4 pb-4">
                <img src={miniBitesIcon} alt="" className="w-8 h-8 " />
                <div className="text-sm font-base">Groceries</div>
              </div>
            </Link>
          </div>
          
          <div className="flex justify-end items-end mt-8 mb-4" onClick={handleVoice}>
            <div className={`max-w-xs p-2`}>
              {output ? (
                splitOutput.map((line, index) => (
                  <div key={index}>{line}</div>
                ))
              ) : (
                "Try saying 'Hey home'"
              )}
            </div>
            <img src={mic} alt="microphone" className="w-10 h-10" />
          </div>

          <div className="flex flex-col items-end text-[10px]">
            <div>Powered by Rusé</div>
          </div>
        </div>
        <ModalHomePage
          isOpen={showModal}
          closeModal={closeModal}
        />
      </div>
    </div>
  );
};

export default HomePage;
