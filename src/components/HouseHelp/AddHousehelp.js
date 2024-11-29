import React, { useState, useEffect } from "react";
import leftArrowIcon from "../../assests/leftArrow.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = process.env.REACT_APP_API;

export default function AddHousehelp() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [househelpData, setHousehelpData] = useState([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(true);
  const [errors, setErrors] = useState({});

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
    role: "",
  });

  const handleCancel = () => {
    setNewHouseHelp({
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
      payment_status: "",
      total_value: "",
      payment_date: "",
      verified: false,
      role: "",
    });
    setErrors({});
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${API}/househelp/categories/all`);
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);


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


  const handleBackButtonClick = () => {
    navigate(-1);
  };


  const validateFields = () => {
    const newErrors = {};
    const currentDate = new Date().toISOString().split("T")[0];

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
      return;
    }

    try {
      const response = await axios.post(
        `${API}/househelp/add`,
        newHouseHelp,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHousehelpData((prevData) => [...prevData, response.data]);
      navigate(`/househelp/${newHouseHelp.role}`);
      setError("");
    } catch (error) {
      console.error("Error creating househelp:", error);
      setError(
        error.response?.data?.message || "Failed to add new househelp. Please try again."
      );
    }
  };

  return (
    <div className="container mx-auto mt-4 p-4 font-poppins max-w-lg">
  <div className="flex items-center gap-2 mb-4">
    <img
      src={leftArrowIcon}
      alt="Back"
      onClick={() => handleBackButtonClick()}
      className="w-10 h-10 cursor-pointer"
    />
    <h2 className="text-[18px] font-semibold">Add Househelp</h2>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <input
        type="text"
        name="name"
        value={newHouseHelp.name}
        onChange={handleInputChange}
        className={`border p-2 rounded w-full ${
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
        className={`border p-2 rounded w-full ${
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
        className="border p-2 rounded w-full"
        placeholder="Aadhar"
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
      />
    </div>

    <div>
      <label>End date</label>
      <input
        type="date"
        name="end_date"
        value={newHouseHelp.end_date}
        onChange={handleInputChange}
        className={`border p-2 rounded w-full ${
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
        className="border p-2 rounded w-full"
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
        name="role"
        value={newHouseHelp.role}
        onChange={handleInputChange}
        className="border p-2 rounded w-full"
      >
        <option value="">Select Role</option>
        {roles.map((role) => (
          <option key={role._id} value={role.name}>
            {role.category_name}
          </option>
        ))}
      </select>
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
      <input
        type="text"
        name="UPI_ID"
        value={newHouseHelp.UPI_ID}
        onChange={handleInputChange}
        className={`border p-2 rounded w-full ${
          errors.UPI_ID ? "border-red-500" : ""
        }`}
        placeholder="UPI ID"
      />
      {errors.UPI_ID && (
        <p className="text-red-500 text-sm">{errors.UPI_ID}</p>
      )}
    </div>

    <div>
      <label>Payment Date</label>
      <input
        type="date"
        name="payment_date"
        value={newHouseHelp.payment_date}
        onChange={handleInputChange}
        className="border p-2 rounded w-full"
      />
    </div>
  </div>

  <div className="flex gap-2 mt-4">
    <button
      onClick={handleCreateHousehelp}
      className="text-white p-2 rounded w-full block"
      style={{ background: "#3d6464" }}
    >
      Submit
    </button>
    <button
      onClick={handleBackButtonClick}
      className="bg-red-400 text-white p-2 rounded w-full block"
    >
      Cancel
    </button>
  </div>

  {error && <div className="text-red-500 mt-4">{error}</div>}
</div>

  );
}
