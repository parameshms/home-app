import roomImg from "../assests/roomImg.png";

import mic from "../assests/mic.png";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import family from '../assests/family.png'
import groceries from '../assests/groceries.png'
import house from '../assests/house.jpg'
import util from '../assests/util.png'
import reminder from '../assests/reminder.png'
import warranty from '../assests/warranty.jpg'




const HomePage = () => { 

  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
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


  const handleImageClick = () => {
    setShowImageModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await axios.put(`${API}/image/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Image uploaded successfully:", response.data);
      setShowImageModal(false);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleImageRemove = async () => {
    try {
      const response = await axios.delete(`${API}/image/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Image removed successfully:", response.data);
      setShowImageModal(false);
    } catch (error) {
      console.error("Error removing image:", error);
    }
  };
 


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
      const response = await axios.get(`${API}/getConsumption`, {
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

  // const handleLogout = () => {
  //   localStorage.removeItem('username');
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('flag')
  //   localStorage.removeItem('role')
  //   navigate('/',{ replace: true });
  //   window.location.reload();
  // };
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
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
        
          </div>
          <div className="grid grid-flow-row border-[1px] rounded-xl">
          <div className="grid grid-cols-2 border-b">

      <div className="flex flex-col items-center justify-center">

           <div className="w-[189px] h-[189px] cursor-pointer relative group">
               <img
                   src={imagePreview || roomImg}
                   alt="Home"
                   className="rounded-xl w-full h-full object-cover object-center"
                   onClick={handleImageClick}
               />
               <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-white font-semibold">Update Image</span>
               </div>
           </div>

           {showImageModal && (
               <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                   <div className="bg-white rounded-lg p-6 shadow-lg w-[90%] max-w-md">
                       <h2 className="text-lg font-bold text-center mb-4">Update Home Image</h2>
                       {imagePreview && (
                           <img
                               src={imagePreview }
                               alt="Preview"
                               className="rounded-lg w-full h-48 object-cover mb-4"
                           />
                       )}
                       <input
                           type="file"
                           accept="image/*"
                           onChange={handleImageChange}
                           className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer mb-4"
                       />
                       <div className="flex justify-between">
                           <button
                               onClick={handleImageUpload}
                               className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                           >
                               Upload
                           </button>
                           <button
                               onClick={handleImageRemove}
                               className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                           >
                               Remove
                           </button>
                           <button
                               onClick={() => setShowImageModal(false)}
                               className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                           >
                               Cancel
                           </button>
                       </div>
                   </div>
               </div>
           )}
       </div>

      
  
    
         

           
    
 


              <div className="flex flex-col">
                <div className="mt-2 px-6 col-span-1 flex flex-col justify-center mt-20">
                  <div className="font-semibold text-[24px] ml-2">
                  {homeDetails.name}
                  </div>
                  <div className="font-light text-[14px] ml-2">
                   
                    Flat No {homeDetails.flat}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Link to="/househelps">
              <div className="col-span-1 flex flex-col justify-center items-center px-3 border rounded-xl bg-white hover:bg-[#819b9b] gap-4 pb-4">
                <img src={house} alt="" className="w-28 h-20 mt-4" />
                <div className="text-sm font-base">Household Management</div>
              </div>
            </Link>
            <Link to="/Addfamily">
              <div className="col-span-1 flex flex-col justify-center items-center px-3 pt-2 border rounded-xl bg-white hover:bg-[#819b9b] gap-4 pb-4">
                <img src={family} alt="" className="w-20 h-20 mt-4 " />
                <div className="text-sm font-base">Add Family</div>
              </div>
            </Link>
      
            <Link to="/groceries/out_of_stock">
              <div className="col-span-1 flex flex-col justify-center items-center px-3 pt-2 border rounded-xl bg-white hover:bg-[#819b9b] gap-4 pb-4">
                <img src={groceries} alt="" className="w-20 h-20 mt-4  " />
                <div className="text-sm font-base">Groceries</div>
              </div>
            </Link>

            <Link to="/utilities">
              <div className="col-span-1 flex flex-col justify-center items-center px-3 pt-2 border rounded-xl bg-white hover:bg-[#819b9b] gap-4 pb-4">
                <img src={util} alt="" className="w-20 h-20 mt-4 " />
                <div className="text-sm font-base">Utilities</div>
              </div>
            </Link>


            <Link to="/reminders">
              <div className="col-span-1 flex flex-col justify-center items-center px-3 pt-2 border rounded-xl bg-white hover:bg-[#819b9b] gap-4 pb-4">
                <img src={reminder} alt="" className="w-20 h-20 mt-4  " />
                <div className="text-sm font-base">Reminders</div>
              </div>
            </Link>

            
            <Link to="/warranties">
              <div className="col-span-1 flex flex-col justify-center items-center px-3 pt-2 border rounded-xl bg-white hover:bg-[#819b9b] gap-4 pb-4">
                <img src={warranty} alt="" className="w-34 h-20 mt-4  " />
                <div className="text-sm font-base">Warranties</div>
              </div>
            </Link>

          </div>
          {/* <div className="flex justify-end items-end mt-8 mb-4" onClick={handleVoice}>
            <div className={`max-w-xs p-2`}>
              {output ? output : "Try saying 'what is last month energy consumption'"}
            </div>
            <img src={mic} alt="microphone" className="w-10 h-10" />
          </div> */}
          
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
