
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddGroceries = () => {
  const [groceries, setGroceries] = useState([]);
  const [addedItems, setAddedItems] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const API = process.env.REACT_APP_API

  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`${API}/groceries`, {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    })
      .then((response) => {
        console.log(response.data)
        setGroceries(response.data.groceries);
      })
      .catch((error) => {
        console.error("Error fetching groceries:", error);
      });
  }, [token]);

  const handleAddItem = (data) => {
    const existingItem = addedItems.find((item) => item.name === data.name);
    if (!existingItem) {
      axios.post(`${API}/groceries/add`, 
        { _id: data._id }, 
        {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        }
      )
        .then((response) => {
          setMessage(response.data.message); 
          setError(''); 
          setAddedItems([...addedItems, data]);
        })
        .catch((error) => {
          setError("Error adding item: " + error.response?.data?.message || error.message); 
          setMessage(''); 
        });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="p-4">

<div className="flex justify-between items-start mt-4">
            <h2 className="font-semibold text-[18px]">My Home</h2>
            <button 
              onClick={handleLogout}
              className="text-white bg-red-500 hover:bg-red-700 text-sm font-semibold py-1 px-2 rounded"
            >
              Logout
            </button>
          </div>

      <h1 className="text-2xl font-bold mb-4">Add Groceries</h1>

  
      {message && <div className="bg-green-200 text-green-700 p-2 rounded mb-4">{message}</div>}
      {error && <div className="bg-red-200 text-red-700 p-2 rounded mb-4">{error}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {groceries.map((grocery) => (
          <div key={grocery.name} className="flex flex-col items-center border p-2 rounded-lg shadow-md">
            <div className="text-[16px] font-semibold mb-2 truncate w-full text-center">{grocery.name}</div>
            <div className="relative">
              <img className="h-28 object-contain mb-2" src={grocery.photo} alt={grocery.name} />
              {addedItems.find(item => item.name === grocery.name) ? (
                <div className="absolute top-20 right-2 p-1 px-2 bg-green-500 text-white font-semibold rounded-md">
                  Added
                </div>
              ) : (
                <div
                  className="absolute top-20 right-2 p-1 px-2 bg-blue-500 text-white font-semibold rounded-md cursor-pointer"
                  onClick={() => handleAddItem(grocery)}
                >
                  ADD
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddGroceries;
