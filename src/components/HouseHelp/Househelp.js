import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import leftArrowIcon from "../../assests/leftArrow.svg";
import { useNavigate } from "react-router-dom";

const HousehelpDetailsPage = () => {
  const { role } = useParams();
  const [househelpData, setHousehelpData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [popupMessage, setPopupMessage] = useState(null);
  const API = process.env.REACT_APP_API
  const token = localStorage.getItem("token");
  const bottomRef = useRef(null);
  const navigate = useNavigate()

  const [newHouseHelp, setNewHouseHelp] = useState({
    name: "",
    phone_number: "",
    photo: "/images/user.png", 
    address: "",
    gender: "",
    adhar: "",
    start_date: "",
    end_date: "",
    daily_value: "",
    weekly_value: "",
    monthly_value: "",
    yearly_value: "",
    payment_mode: "",
    UPI_ID: "",
    acc: "",
    ifsc: "",
    payment_type: "",
    payment_status: "Pending",
    total_value: "",
    payment_date: "",
    verified: false,
  });

  // useEffect(() => {
    const fetchHousehelpDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API}/househelp/all?role=${role}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setHousehelpData(response.data);
          setError(null);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError(err.response.data.error);
        } else {
          setError(err.message);
        }
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };

  //   fetchHousehelpDetails();
  // }, [role]);

  useEffect(() => {
    fetchHousehelpDetails();
  }, [role]);

  const handleBackButtonClick = () => {
    window.history.back();
  };

  const validateFields = () => {
    const newErrors = {};
    const currentDate = new Date().toISOString().split("T")[0]; // today's date YYYY-MM-DD format

    if (!newHouseHelp.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (newHouseHelp.phone_number && !/^\d{10}$/.test(newHouseHelp.phone_number)) {
      newErrors.phone_number = "Valid 10-digit phone number is required.";
    }

    if (newHouseHelp.end_date && newHouseHelp.end_date <= currentDate) {
      newErrors.end_date = "End date must be greater than the current date.";
    }

    if (newHouseHelp.payment_mode === "UPI" && !newHouseHelp.UPI_ID.trim()) {
      newErrors.UPI_ID = "UPI ID is required for UPI payment mode.";
    }
    if (
      newHouseHelp.payment_mode === "Bank Transfer" &&
      (!newHouseHelp.acc.trim() || !newHouseHelp.ifsc.trim())
    ) {
      newErrors.acc = "Account number is required for bank transfer.";
      newErrors.ifsc = "IFSC code is required for bank transfer.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };
  const handleCreateHousehelp = async () => {
  
    if (!validateFields()) {
      console.log("Form has errors:", errors);
      return; 
    }
  
    console.log("Form is valid, submitting:", newHouseHelp);

  
    try {
      const response = await axios.post(
        `${API}/househelp/add`,
        {
          ...newHouseHelp,
          role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // setHousehelpData([response.data]); 
      await fetchHousehelpDetails()
      setNewHouseHelp({}); 
      setError(null);
    } catch (error) {
      console.error("Error creating househelp:", error);
  
      const errorMessage = 
        error.response?.data?.message || 
        "Failed to add new househelp. Please try again.";
      setError(errorMessage);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHouseHelp((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  

  

  const handleUpdateStatus = async (househelpId, status) => {
    try {
      await axios.put(
        `${API}/househelp/updatePaymentStatus`,
        { payment_status: status,
          user_id:househelpId
         },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (status === "Paid") {
        // Update payment date
        await axios.patch(`${API}/househelp/updatePaymentDate`,
          { 
            househelp_id:househelpId
           },
            {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

       await fetchHousehelpDetails(); 
       setPopupMessage(`Payment status updated to "${status}"`); 
      setTimeout(() => setPopupMessage(null), 3000);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const renderPopup = () => {
    if (!popupMessage) return null;

    return (
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded shadow-md z-50">
        {popupMessage}
      </div>
    );
  };

  const renderStatus = (status) => {
    return (
      <span
        className={`px-2 py-1 rounded ${
          status === "Paid" ? "bg-green-500 text-white" : "bg-orange-500 text-white"
        }`}
      >
        {status}
      </span>
    );
  };




  const handleDelete = async (userId) => {
    try {
   
      await axios.delete(`${API}/househelp/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          househelp_id: userId,
        },
      });

      await fetchHousehelpDetails()
      setError(""); 
    } catch (error) {
      console.error("Error in deletion:", error);
      setError("Please try again.");
    }
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  const renderHousehelpCards = () => {
    if (!househelpData.househelps || househelpData.househelps.length === 0) {
      return (
        <div className="text-center">
          <p>No househelp found for {role}.</p>
          <button
             type="button"
             className="text-white bg-slate-400 focus:ring-1 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
             onClick={() => {
               bottomRef.current.scrollIntoView({ behavior: "smooth" });
             }}
          >
            Add {role}
            <svg
              className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {househelpData.househelps.map((househelp, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center mb-4">
              <img
                src={househelp.personal_info.photo || "https://via.placeholder.com/150"}
                alt={househelp.personal_info.name || "No Name"}
                className="w-24 h-24 rounded-full mr-4 object-cover"
              />
              <div>
                <h2 className="text-xl font-bold">
                  {househelp.role && househelp.personal_info.name
                    ? `${househelp.role} ${househelp.personal_info.name}`
                    : househelp.role || househelp.personal_info.name || "No Name"}
                </h2>
                {househelp.personal_info.phone_number && (
                  <p className="text-gray-600">
                    Phone: {househelp.personal_info.phone_number}
                  </p>
                )}
                {househelp.personal_info.gender && (
                  <p className="text-gray-600">Gender: {househelp.personal_info.gender}</p>
                )}
                {househelp.pin && (
                  <p className="text-gray-600">PIN: {househelp.pin}</p>
                )}
              </div>
            </div>
            {househelp.personal_info.address && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Address:</h3>
                <p className="text-gray-600">{househelp.personal_info.address}</p>
              </div>
            )}
            {househelp.kyc_info && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold">KYC Info:</h3>
                {househelp.kyc_info.adhar && (
                  <p className="text-gray-600">Adhar: {househelp.kyc_info.adhar}</p>
                )}
                <p className="text-gray-600">
                  Verified: {househelp.kyc_info.verified ? "Yes" : "No"}
                </p>
              </div>
            )}
             <h3 className="text-lg font-semibold">Financial Info:</h3>
            <p className="text-gray-600">
                    Payment Status:{renderStatus(househelp.payment_status)}
                  </p>
            {househelp.financial_info && (
              <div className="mb-4">
                {househelp.financial_info.total_value && (
                  <p className="text-gray-600">
                    Total Value: ₹{househelp.financial_info.total_value}
                  </p>
                )}
                {househelp.financial_info.payment_type && (
                  <p className="text-gray-600">
                    Payment Type: {househelp.financial_info.payment_type}
                  </p>
                )}
                {househelp.financial_info.start_date && (
                  <p className="text-gray-600">
                    Start Date:{" "}
                    {new Date(househelp.financial_info.start_date).toDateString()}
                  </p>
                )}
                {househelp.financial_info.end_date && (
                  <p className="text-gray-600">
                    End Date:{" "}
                    {new Date(househelp.financial_info.end_date).toDateString()}
                  </p>
                )}
              </div>  
            )}
            {househelp.financial_info?.payment_details?.UPI_ID && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Payment Mode:</h3>
                <p className="text-gray-600">
                  UPI ID: {househelp.financial_info.payment_details.UPI_ID}
                </p>
              </div>
            )}

            
            {househelp.financial_info?.payment_date && (
              <div className="mb-4">
                
                <h3 className="text-lg font-semibold">Payment Info:</h3>
                <p className="text-gray-600">
                  Next payment Date: {househelp.financial_info.payment_date}
                </p>

                {new Date(househelp.financial_info.payment_date) < new Date() &&
                  househelp.payment_status !== "Pending" && (
                  handleUpdateStatus(househelp._id, "Pending")
                  )}

                {househelp.payment_status !== "Paid" && (
                  <div className="mt-4 flex justify-between">
          <button
              onClick={() =>
                handleUpdateStatus(
                  househelp._id,
                  househelp.payment_status === "Pending"
                    ? "Paid"
                    : "Pending"
                )
              }
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            >
              {househelp.payment_status === "Pending"
                ? "Mark as Paid"
                : "Mark as Pending"}
            </button>
           
          </div>   
             
                )}
              <button
          onClick={() => handleDelete(househelp._id)}
           className="text-white bg-amber-600 px-4 py-2 rounded mt-2"
            >
            Delete {role}
            </button>
              </div>
            )}

         
           
          </div>
        ))}
      </div>
    );
    
  };

  return (
    <div className="container mx-auto p-4">
       <img 
    src={leftArrowIcon} 
    alt="" 
    onClick={() => handleBackButtonClick()} 
    className="w-10 h-10 cursor-pointer" 
        />
      <h3 className="text-xl font-bold mb-8">Househelp Details - {role}</h3>

      
       {renderPopup()}  
      {renderHousehelpCards()}

      <div className="flex justify-end mt-5">
        {househelpData.househelps && househelpData.househelps.length > 0 && (
          <button
            type="button"
            className="text-white bg-slate-400 focus:ring-1 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={() => navigate("/addHouseHelps")}
          >
            Add {role}
            <svg
              className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </button>
        )}
      </div>

     
   </div>
  );
};


export default HousehelpDetailsPage;