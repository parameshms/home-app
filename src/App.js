import React, { useEffect, useState,CSSProperties } from "react";
import "./App.css";
import logo from "./assests/RuseLogo.svg";
import { useNavigate } from "react-router-dom";
import PuffLoader from "react-spinners/PuffLoader";
import API from './api';

const App = () => {
  const AUTH_API = process.env.REACT_APP_API;
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Start loading

    // try {
    //   const response = await fetch(`${AUTH_API}/login`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       email: email,
    //       password: password,
    //     }),
    //   });
    //   const data = await response.json();
    try {
      const response = await API.post('/login', {
        email,
        password,
      });
  
      const data = response.data;

      if (data?.error) {
        setError(data?.error);
      } else if (data?.flag === true) {
        navigate("/home");
        localStorage.setItem("token", data?.token);
        localStorage.setItem("username", data?.username);
        localStorage.setItem("role", data?.role);
        localStorage.setItem('flag', data?.flag);
        localStorage.setItem('refreshToken', data?.refresh_token);
     

      } else if (data?.role === "maid" || data?.role === "Cook") {
        navigate("/AddGroceries");
        localStorage.setItem("token", data?.token);
        localStorage.setItem("username", data?.username);
        localStorage.setItem("role", data?.role);
        localStorage.setItem('refreshToken', data?.refresh_token);
      } else if (data?.flag === false && data?.role === "Owner") {
        navigate("/approval");
        localStorage.setItem('flag', data?.flag);
      } else {
        setError("Unexpected response");
      }

    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);  
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center font-poppins tracking-wide">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-24">
          <img className="mx-auto sm:w-18 h-18" src={logo} alt="Your Company" />
          <h3 className="mt-10 mb-2 text-center text-[18px] font-medium leading-9  text-[#3D6464]">
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
            <div>
              <label className="block text-[12px] font-base leading-6 text-gray-900">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  type="text"
                  required
                  placeholder="Enter your username"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded-md py-2 text-gray-900 shadow-sm  placeholder:text-gray-400 outline-none p-2 text-[10px] font-base"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-[12px] font-base leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  type="password"
                  value={password}
                  autoComplete="current-password"
                  required
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded-md py-2 text-gray-900 shadow-sm  placeholder:text-gray-400 outline-none p-2 text-[10px] font-base mb-2"
                />
              </div>

              <div className="text-sm justify-end">
                <a
                  href="/register"
                  className="flex flex-row-reverse text-[12px] font-base text-blue-500 hover:text-blue-400"
                >
                  New user? Register here
                </a>
              </div>
              
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-[#3D6464] px-3 py-1.5 text-sm font-medium tracking-wide leading-6 text-white shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:text-gray-400"
                disabled={loading}  
              >
                {loading ? <PuffLoader color="#508750" />: "Login"}  
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default App;
