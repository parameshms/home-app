import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import leftArrowIcon from "../../assests/leftArrow.svg";

const HousehelpDetailsPage = () => {
  const { role } = useParams();
  const [househelpData, setHousehelpData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);
  const API = process.env.REACT_APP_API
  const token = localStorage.getItem("token");
  const bottomRef = useRef(null);
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
      setShowForm(false); 
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
    } catch (error) {
      console.error("Error updating status:", error);
    }
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
               setShowForm(true);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
             
              </div>
            )}

          <button
          onClick={() => handleDelete(househelp._id)}
           className="text-white bg-red-500 rounded-lg px-4 py-2 ml-56"
            >
            Delete {role}
            </button>
           
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

      

      {renderHousehelpCards()}

      <div className="flex justify-end mt-5">
        {househelpData.househelps && househelpData.househelps.length > 0 && (
          <button
            type="button"
            className="text-white bg-slate-400 focus:ring-1 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={() => setShowForm(true)}
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

      {showForm   && (
         <div ref={bottomRef}>
  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
    {/* <div>
      <input
        type="text"
        name="name"
        value={newHouseHelp.name}
        onChange={handleInputChange}
        className="border p-2 rounded w-full block"
        placeholder="Name"
        required
      />
    </div> */}
    <div>
            <input
              type="text"
              name="name"
              value={newHouseHelp.name}
              onChange={handleInputChange}
              className={`border p-2 rounded w-full block ${
                errors.name ? "border-red-500" : ""
              }`}
              placeholder="Name"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div>
            <input
              type="text"
              name="phone_number"
              value={newHouseHelp.phone_number}
              onChange={handleInputChange}
              className={`border p-2 rounded w-full block ${
                errors.phone_number ? "border-red-500" : ""
              }`}
              placeholder="Phone Number"
            />
            {errors.phone_number && (
              <p className="text-red-500 text-sm">{errors.phone_number}</p>
            )}
          </div>
    <div>
      <input
        type="text"
        name="adhar"
        value={newHouseHelp.adhar}
        onChange={handleInputChange}
        className="border p-2 rounded w-full block"
        placeholder="Aadhar"
        required
      />
    </div>
    <div>
      <input
        type="text"
        name="address"
        value={newHouseHelp.address}
        onChange={handleInputChange}
        className="border p-2 rounded w-full block"
        placeholder="Address"
        required
      />
    </div>

    <div>
      <label>Start date</label>
      <input
        type="date"
        name="start_date"
        value={newHouseHelp.start_date}
        onChange={handleInputChange}
        className="border p-2 rounded w-full block"
        required
      />
    </div>
    <div>
            <label>End date</label>
            <input
              type="date"
              name="end_date"
              value={newHouseHelp.end_date}
              onChange={handleInputChange}
              className={`border p-2 rounded w-full block ${
                errors.end_date ? "border-red-500" : ""
              }`}
            />
            {errors.end_date && (
              <p className="text-red-500 text-sm">{errors.end_date}</p>
            )}
          </div>


    <div>
      <select
        name="gender"
        value={newHouseHelp.gender}
        onChange={handleInputChange}
        className="border p-2 rounded w-full block"
        required
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
    </div>

    <div>
      <select
        name="payment_type"
        value={newHouseHelp.payment_type}
        onChange={handleInputChange}
        className="border p-2 rounded w-full block"
        required
      >
        <option value="">Payment Type</option>
        <option value="Daily">Daily</option>
        <option value="Weekly">Weekly</option>
        <option value="Monthly">Monthly</option>
        <option value="Yearly">Yearly</option>
      </select>
    </div>

    <div>
      <input
        type="text"
        name="total_value"
        value={newHouseHelp.total_value}
        onChange={handleInputChange}
        className="border p-2 rounded w-full block"
        placeholder="Total Value"
        required
      />
    </div>

   

    <div>
            <select
              name="payment_mode"
              value={newHouseHelp.payment_mode}
              onChange={handleInputChange}
              className={`border p-2 rounded w-full block ${
                errors.payment_mode ? "border-red-500" : ""
              }`}
            >
              <option value="">Payment Mode</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
            {errors.payment_mode && (
              <p className="text-red-500 text-sm">{errors.payment_mode}</p>
            )}
          </div>
          <div>
              <input
                type="text"
                name="UPI_ID"
                value={newHouseHelp.UPI_ID}
                onChange={handleInputChange}
                className={`border p-2 rounded w-full block ${
                  errors.UPI_ID ? "border-red-500" : ""
                }`}
                placeholder="UPI ID"
              />
              {errors.UPI_ID && (
                <p className="text-red-500 text-sm">{errors.UPI_ID}</p>
              )}
            </div>

            {newHouseHelp.payment_mode === "Bank Transfer" && (
            <>
              <div>
                <input
                  type="text"
                  name="acc"
                  value={newHouseHelp.acc}
                  onChange={handleInputChange}
                  className={`border p-2 rounded w-full block ${
                    errors.acc ? "border-red-500" : ""
                  }`}
                  placeholder="Account Number"
                />
                {errors.acc && (
                  <p className="text-red-500 text-sm">{errors.acc}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="ifsc"
                  value={newHouseHelp.ifsc}
                  onChange={handleInputChange}
                  className={`border p-2 rounded w-full block ${
                    errors.ifsc ? "border-red-500" : ""
                  }`}
                  placeholder="IFSC Code"
                />
                {errors.ifsc && (
                  <p className="text-red-500 text-sm">{errors.ifsc}</p>
                )}
              </div>
            </>
          )}
 <div>
      <label>Payment Date</label>
      <input
        type="date"
        name="payment_date"
        value={newHouseHelp.payment_date}
        onChange={handleInputChange}
        className="border p-2 rounded w-full block"
        required
      />
    </div>
<div className="flex gap-2 col-span-2">
            <button
              onClick={handleCreateHousehelp}
              className="text-white p-2 rounded w-full block"
              style={{ background: "#3d6464" }}
            >
              Submit
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-red-400 text-white p-2 rounded w-full block"
            >
              Cancel
            </button>
          </div>
  </div>
  </div>
)}

   </div>
  );
};


export default HousehelpDetailsPage;