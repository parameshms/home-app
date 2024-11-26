import React, { useState } from "react";
import "../App.css";
import logo from "../assests/RuseLogo.svg";
import { useNavigate } from "react-router-dom";
import PuffLoader from "react-spinners/PuffLoader";

export default function Register() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [flatNo, setFlatNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate();

  const AUTH_API = process.env.REACT_APP_API

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)

    // Validate password and confirm password
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      
      const response = await fetch(`${AUTH_API}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname,
          lastname,
          building_name: buildingName,
          flat_no: flatNo,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data?.error) {
        setError(data?.error);
      } else {
        navigate(`/`);
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    }
    finally{
      setLoading(false)
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center font-poppins tracking-wide">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-24">
          <img className="mx-auto sm:w-18 h-18" src={logo} alt="Your Company" />
          <h3 className="mt-10 mb-2 text-center text-[18px] font-medium leading-9 text-[#3D6464]">
            Welcome to MyCloc
          </h3>
        </div>
        {error && (
          <p className="text-red-500 flex justify-center text-center">
            {error}
          </p>
        )}
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm px-4">
          <form className="space-y-6" onSubmit={handleOnSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-base leading-6 text-gray-900">
                  First Name
                </label>
                <div className="mt-2">
                  <input
                    id="firstname"
                    type="text"
                    required
                    placeholder="Enter your first name"
                    onChange={(e) => setFirstname(e.target.value)}
                    className="w-full border rounded-md py-2 text-gray-900 shadow-sm placeholder:text-gray-400 outline-none p-2 text-[10px] font-base"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-base leading-6 text-gray-900">
                  Last Name
                </label>
                <div className="mt-2">
                  <input
                    id="lastname"
                    type="text"
                    required
                    placeholder="Enter your last name"
                    onChange={(e) => setLastname(e.target.value)}
                    className="w-full border rounded-md py-2 text-gray-900 shadow-sm placeholder:text-gray-400 outline-none p-2 text-[10px] font-base"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-base leading-6 text-gray-900">
                  Building Name
                </label>
                <div className="mt-2">
                  <input
                    id="building_name"
                    type="text"
                    required
                    placeholder="Enter your building name"
                    onChange={(e) => setBuildingName(e.target.value)}
                    className="w-full border rounded-md py-2 text-gray-900 shadow-sm placeholder:text-gray-400 outline-none p-2 text-[10px] font-base"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-base leading-6 text-gray-900">
                  Flat No
                </label>
                <div className="mt-2">
                  <input
                    id="flat_no"
                    type="text"
                    required
                    placeholder="Enter your flat number"
                    onChange={(e) => setFlatNo(e.target.value)}
                    className="w-full border rounded-md py-2 text-gray-900 shadow-sm placeholder:text-gray-400 outline-none p-2 text-[10px] font-base"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-base leading-6 text-gray-900">
                  Email
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border rounded-md py-2 text-gray-900 shadow-sm placeholder:text-gray-400 outline-none p-2 text-[10px] font-base"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-base leading-6 text-gray-900">
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    autoComplete="current-password"
                    required
                    placeholder="Enter password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border rounded-md py-2 text-gray-900 shadow-sm placeholder:text-gray-400 outline-none p-2 text-[10px] font-base"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-base leading-6 text-gray-900">
                  Confirm Password
                </label>
                <div className="mt-2">
                  <input
                    id="confirm_password"
                    type="password"
                    value={confirmPassword}
                    required
                    placeholder="Confirm password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border rounded-md py-2 text-gray-900 shadow-sm placeholder:text-gray-400 outline-none p-2 text-[10px] font-base"
                  />
                </div>
              </div>
            </div>

            <div className="text-sm justify-end">
              <a
                href="/"
                className="flex flex-row-reverse text-[12px] font-base text-blue-500 hover:text-blue-400"
              >
                Already Registered? Click to login
              </a>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-[#3D6464] px-3 py-1.5 text-sm font-medium tracking-wide leading-6 text-white shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:text-gray-400"
                disabled = {loading}
              >
                {loading? <PuffLoader color="#508750"/> : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
