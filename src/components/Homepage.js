import roomImg from "../assests/roomImg.png";

import miniBitesIcon from "../assests/miniBitesIcon.svg";
import foodIcon from "../assests/foodIcon.svg";
import deviceControlIcon from "../assests/deviceControlIcon.svg";
import mic from "../assests/mic.png";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";




const HomePage = () => { 

  const [showModal, setShowModal] = useState(false);
  const [output, setOutput] = useState("");
  const [socket, setSocket] = useState(null);
  const [homeDetails, setHomeDetails] = useState({}); 
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API;
  
  useEffect(() => {
    const fetchHomeDetails = async () => {
      try {
        const response = await axios.get(`${API}/home`, {
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
  }, [token,API]);


 


  const intents = {
  
    energy_consumption: [
      "energy",
      "consumption",
      "units",
      "energy consumption",
      "last month energy consumption",
      "previous month energy consumption",
    ],
  };

  const predictIntent = (text) => {
    text = text.toLowerCase();
    for (const [intent, keywords] of Object.entries(intents)) {
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          return { intent, command: keyword };
        }
      }
    }
    return { intent: "unknown", command: "" };
  };

  const extractMonth = (text) => {
    text = text.toLowerCase();
    const currentMonth = moment().month() + 1;
    const currentYear = moment().year();

    if (text.includes("current month")) {
      return { month: currentMonth, year: currentYear };
    } else if (text.includes("previous month") || text.includes("last month")) {
      const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;
      return { month: previousMonth, year: previousYear };
    } else {
      const monthNames = moment.months();
      for (let i = 0; i < monthNames.length; i++) {
        if (text.includes(monthNames[i].toLowerCase())) {
          return { month: i + 1, year: currentYear };
        }
      }
    }
    return { month: null, year: null };
  };
  function speakText(text) {
    
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
    
      utterance.lang = "en-US";
      utterance.rate = 0.5; // Speed
      utterance.pitch = 1; // Pitch
      
    
      window.speechSynthesis.speak(utterance);
    } else {
      console.error("Speech synthesis not supported in this browser.");
    }
  }

  async function getConsumption(month,year) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    
  
    try {
      const response = await axios.get(`http://127.0.0.1:5052/getConsumption`, {
        headers,
        params: { month, year }
      });
    
      return response.data;
        
     
    } catch (error) {
      return { error: error.message };
    }
  }

  const handleVoice = () => {
    setOutput("");
    try {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.start();
  
      recognition.onresult = async (event) => {
        const speechText = event.results[0][0].transcript;
        setOutput(speechText);
        console.log("Speech Text:", speechText);
  
        const { intent, command } = predictIntent(speechText);
        console.log(`Detected intent: ${intent}, Command: ${command}`)
        let responseText = ""
  
        if (intent === "energy_consumption") {
          const { month, year } = extractMonth(speechText);
          
          try {
            const res = await getConsumption(month, year);
            console.log("Consumption Data:", res);
  
            if (!res.error) {
              const units = res.unitsConsumed || "No data available";
              console.log("Units Consumed:", units);
              speakText(`${units} units consumed`);
              responseText += `Units Consumed: ${units}`;
            } else {
              console.log("Error:", res.error);
              speakText("Please Try again")
              responseText += `please try again `;
            }
          } catch (error) {
            console.error("Error fetching consumption data:", error);
            responseText += 'please try again';
            speakText("Please Try again")
          }
        }
  
        setOutput(responseText);
      };
  
      recognition.onspeechend = () => recognition.stop();
  
      recognition.onerror = (error) => {
        console.error("Speech Recognition Error:", error);
        setOutput("Speech recognition error. Please try again.");
      };
    } catch (error) {
      console.error("Error with voice handling:", error);
      setOutput("Error initializing voice recognition.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('flag')
    localStorage.removeItem('role')
    navigate('/',{ replace: true });
    window.location.reload();
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
            <button 
              onClick={handleLogout}
              className="text-white bg-red-500 hover:bg-red-700 text-sm font-semibold py-1 px-2 rounded"
            >
              Logout
            </button>
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
                <div className="mt-2 px-6 col-span-1 flex flex-col justify-center border-b h-1/2">
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
            <Link to="/Addfamily">
              <div className="col-span-1 flex flex-col justify-center items-center px-3 pt-2 border rounded-xl bg-white hover:bg-[#819b9b] gap-4 pb-4">
                <img src={foodIcon} alt="" className="w-8 h-8 " />
                <div className="text-sm font-base">Add Family</div>
              </div>
            </Link>
      
            <Link to="/groceries/out_of_stock">
              <div className="col-span-1 flex flex-col justify-center items-center px-3 pt-2 border rounded-xl bg-white hover:bg-[#819b9b] gap-4 pb-4">
                <img src={miniBitesIcon} alt="" className="w-8 h-8 " />
                <div className="text-sm font-base">Groceries</div>
              </div>
            </Link>

            <Link to="/utilities">
              <div className="col-span-1 flex flex-col justify-center items-center px-3 pt-2 border rounded-xl bg-white hover:bg-[#819b9b] gap-4 pb-4">
                <img src={miniBitesIcon} alt="" className="w-8 h-8 " />
                <div className="text-sm font-base">Utilities</div>
              </div>
            </Link>


            <Link to="/reminders">
              <div className="col-span-1 flex flex-col justify-center items-center px-3 pt-2 border rounded-xl bg-white hover:bg-[#819b9b] gap-4 pb-4">
                <img src={miniBitesIcon} alt="" className="w-8 h-8 " />
                <div className="text-sm font-base">Reminders</div>
              </div>
            </Link>

          </div>
          <div className="flex justify-end items-end mt-8 mb-4" onClick={handleVoice}>
            <div className={`max-w-xs p-2`}>
              {output ? output : "Try saying 'what is last month energy consumption'"}
            </div>
            <img src={mic} alt="microphone" className="w-10 h-10" />
          </div>
          
          {/* <div className="flex justify-end items-end mt-8 mb-4" onClick={handleVoice}>
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
          </div> */}

          <div className="flex flex-col items-end text-[10px]">
            <div>Powered by Rusé</div>
          </div>
        </div>
        {/* <ModalHomePage
          isOpen={showModal}
          closeModal={closeModal}
        /> */}
      </div>
    </div>
  );
};

export default HomePage;
