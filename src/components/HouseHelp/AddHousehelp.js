import React, { useState, useEffect } from "react";
import leftArrowIcon from "../../assests/leftArrow.svg";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const API = process.env.REACT_APP_API;

export default function AddHousehelp() {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [househelpData, setHousehelpData] = useState([]);
    const [error, setError] = useState("");

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
        role: ""
    });

    useEffect(() => {
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewHouseHelp((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleBackButtonClick = () => {
        window.history.back();
    };

    const handleCreateHousehelp = async () => {
        try {
            const response = await axios.post(
                `${API}/househelp/add`,
                { ...newHouseHelp },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setHousehelpData([...househelpData, response.data]);
            navigate(`/househelp/${newHouseHelp.role}`);
        } catch (error) {
            console.error("Error creating househelp:", error);
            setError("Failed to add new househelp. Please try again.");
        }
    };

    return (
        <div className="container mx-auto mt-4 p-4 font-poppins max-w-lg">
            <div className="flex items-center gap-2 mb-4">
                <img src={leftArrowIcon} alt="Back" onClick={handleBackButtonClick} className="cursor-pointer" />
                <h2 className="text-[18px] font-semibold">Add Househelp</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="text"
                    name="name"
                    value={newHouseHelp.name}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full block"
                    placeholder="Name"
                    required
                />
                <input
                    type="text"
                    name="phone_number"
                    value={newHouseHelp.phone_number}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full block"
                    placeholder="Phone Number"
                    required
                />
                <input
                    type="text"
                    name="adhar"
                    value={newHouseHelp.adhar}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full block"
                    placeholder="Aadhar"
                    required
                />
                <input
                    type="text"
                    name="address"
                    value={newHouseHelp.address}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full block"
                    placeholder="Address"
                    required
                />

                {/* Additional Fields */}
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
                        className="border p-2 rounded w-full block"
                    />
                </div>

                {/* Drop-down Fields */}
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
                <select
                    name="role"
                    value={newHouseHelp.role}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full block"
                    required
                >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                        <option key={role._id} value={role.name}>{role.category_name}</option>
                    ))}
                </select>

                {/* Payment Information */}
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

                {/* Action Buttons */}
                <div className="flex gap-2 col-span-2">
                    <button
                        onClick={handleCreateHousehelp}
                        className="text-white p-2 rounded w-full"
                        style={{ background: '#3d6464' }}
                    >
                        Submit
                    </button>
                    <button
                        onClick={() => navigate('/househelp')}
                        className="bg-red-400 text-white p-2 rounded w-full"
                    >
                        Cancel
                    </button>
                </div>

                {error && <div className="text-red-500 col-span-2">{error}</div>}
            </div>
        </div>
    );
}
