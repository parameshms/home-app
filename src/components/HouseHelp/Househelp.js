import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import leftArrowIcon from "../../assests/leftArrow.svg";

const HousehelpDetailsPage = () => {
  const { role } = useParams(); // Get the role from the URL
  const [househelpData, setHousehelpData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
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

  useEffect(() => {
    const fetchHousehelpDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://127.0.0.1:5051/househelp/all?role=${role}`,
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

    fetchHousehelpDetails();
  }, [role]);

  const handleBackButtonClick = () => {
    window.history.back();
  };

  const handleCreateHousehelp = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://127.0.0.1:5051/househelp/add",
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
      setHousehelpData([...househelpData, response.data]); 
      setShowForm(false); 
    } catch (error) {
      console.error("Error creating househelp:", error);
      setError("Failed to add new househelp. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHouseHelp((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
                alt={househelp.personal_info.name}
                className="w-24 h-24 rounded-full mr-4 object-cover"
              />
              <div>
                <h2 className="text-xl font-bold">
                  {househelp.role} - {househelp.personal_info.name}
                </h2>
                <p className="text-gray-600">
                  Phone: {househelp.personal_info.phone_number}
                </p>
                <p className="text-gray-600">
                  Gender: {househelp.personal_info.gender}
                </p>
                <p className="text-gray-600">
                  
                  PIN: {househelp.pin}
                </p>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Address:</h3>
              <p className="text-gray-600">{househelp.personal_info.address}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">KYC Info:</h3>
              <p className="text-gray-600">Adhar: {househelp.kyc_info.adhar}</p>
              <p className="text-gray-600">
                Verified: {househelp.kyc_info.verified ? "Yes" : "No"}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Financial Info:</h3>
              <p className="text-gray-600">
                Payment Status: {househelp.financial_info.payment_status}
              </p>
              <p className="text-gray-600">
                Total Value: ₹{househelp.financial_info.total_value }
              </p>
              <p className="text-gray-600">
                Payment Type: {househelp.financial_info.payment_type}
              </p>
              <p className="text-gray-600">
              Start Date:{" "}
              {househelp.financial_info?.start_date
              ? new Date(househelp.financial_info.start_date).toDateString(): "N/A"}

              </p>
              <p className="text-gray-600">
                End Date: {new Date(househelp.financial_info.end_date).toDateString()}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Payment Mode:</h3>
              <p className="text-gray-600">
                   UPI ID: {househelp.financial_info.payment_details.UPI_ID}
                </p>

            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold">Payment Mode:</h3>
              <p className="text-gray-600">
                Payment Date: {househelp.financial_info.payment_date}th of every month`
              </p>
            </div>
            
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <img src={leftArrowIcon} alt="" onClick={() => handleBackButtonClick()} />
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

      {showForm && (
  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
   
      <input
        type="text"
        name="name"
        value={newHouseHelp.name}
        onChange={handleInputChange}
        className="border p-2 rounded w-full"
        placeholder="Name"
        required
      />
    </div>
    <div>
  
      <input
        type="text"
        name="phone_number"
        value={newHouseHelp.phone_number}
        onChange={handleInputChange}
        className="border p-2 rounded w-full"
        placeholder="Phone Number"
        required
      />
    </div>
    <div>
   
      <input
        type="text"
        name="adhar"
        value={newHouseHelp.adhar}
        onChange={handleInputChange}
        className="border p-2 rounded w-full"
        placeholder="Adhar"
        required
      />
    </div>
    <div>
      <input
        type="text"
        name="address"
        value={newHouseHelp.address}
        onChange={handleInputChange}
        className="border p-2 rounded w-full"
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
        className="border p-2 rounded w-full"
        placeholder="Start Date"
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
        className="border p-2 rounded w-full"
        placeholder="End Date"
      />
    </div>
    <div>
      <select
        name="gender"
        value={newHouseHelp.gender}
        onChange={handleInputChange}
        className="border p-2 rounded w-full"
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
        className="border p-2 rounded w-full"
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
        className="border p-2 rounded w-full"
        placeholder="Total Value"
        required
      />
    </div>

    <div>
      <input
        type="text"
        name="payment_date"
        value={newHouseHelp.payment_date}
        onChange={handleInputChange}
        className="border p-2 rounded w-full"
        placeholder="Payment Date"
        required
      />
    </div>

    <div>
      <select
        name="payment_mode"
        value={newHouseHelp.payment_mode}
        onChange={handleInputChange}
        className="border p-2 rounded w-full"
        required
      >
        <option value="">Payment Mode</option>
        <option value="Daily">Cash</option>
        <option value="Weekly">UPI</option>
        <option value="Monthly">Bank Transfer</option>
      </select>
    </div>


    <div>
            <input
              type="text"
              name="UPI_ID"
              value={newHouseHelp.UPI_ID}   
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
              placeholder="UPI ID"
            />
          </div>
          <div>
            <input
              type="text"
              name="acc"
              value={newHouseHelp.acc}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
              placeholder="Account Number"
            />
          </div>
          <div>
            <input
              type="text"
              name="ifsc"
              value={newHouseHelp.ifsc}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
              placeholder="IFSC Code "
            />
          </div>

          <div className="flex gap-2 col-span-2">
            <button
              onClick={handleCreateHousehelp}
              className="text-white p-2 rounded w-full"
              style={{ background: '#3d6464' }}
            >
              Submit
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-red-400 text-white p-2 rounded w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
   </div>
  );
};


export default HousehelpDetailsPage;