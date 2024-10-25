import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OutOfStockGroceries = () => {
  const [outOfStockGroceries, setOutOfStockGroceries] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  const token = localStorage.getItem('token');
 

  useEffect(() => {
    fetchOutOfStockGroceries();
  }, [token]);

  const fetchOutOfStockGroceries = () => {
    setLoading(true);
    axios.get('http://127.0.0.1:8081/groceries/outofstock', {
    
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((response) => {
      setOutOfStockGroceries(response.data.out_of_stock);
      setLoading(false);
    })
    .catch((error) => {
      setError(error.response?.data?.error || "Error fetching out-of-stock groceries.");
      setLoading(false);
    });
  };

  const handleLaterClick = (grocery) => {
    
    axios.delete('http://127.0.0.1:8081/groceries/outofstock/delete', {
      data: { _id: grocery._id },
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      
      setOutOfStockGroceries(outOfStockGroceries.filter(item => item._id !== grocery._id));
      console.log(`Removed ${grocery.name} from out of stock list`);
    })
    .catch((error) => {
      setError(error.response?.data?.error || `Error removing ${grocery.name} from out-of-stock list.`);
    });
  };

  const handleOrderClick = (grocery) => {
 
    axios.put('http://127.0.0.1:8081/groceries/outofstock/update', 
      { _id: grocery._id },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(() => {
      console.log(`Ordered ${grocery.name}`);
    
      setOutOfStockGroceries(outOfStockGroceries.map(item => 
        item._id === grocery._id ? { ...item, status: 'ordered' } : item
      ));
    })
    .catch((error) => {
      setError(error.response?.data?.error || `Error marking ${grocery.name} as ordered.`);
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Out of Stock Groceries</h1>
      
      {error && <div className="bg-red-200 text-red-700 p-2 rounded mb-4">{error}</div>}
      {!error && outOfStockGroceries.length === 0 && (
        <div className="bg-yellow-200 text-yellow-700 p-2 rounded mb-4">No out-of-stock groceries found.</div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {outOfStockGroceries.map((grocery) => (
          <div key={grocery._id} className="flex flex-col items-center border p-2 rounded-lg shadow-md">
            <div className="text-[16px] font-semibold mb-2 truncate w-full text-center">{grocery.name}</div>
            <div className="relative">
              <img className="h-28 object-contain mb-2" src={grocery.photo} alt={grocery.name} />
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => handleLaterClick(grocery)}
                  className="bg-yellow-500 text-white font-semibold p-1 px-2 rounded-md"
                >
                  Later
                </button>
                <button
                  onClick={() => handleOrderClick(grocery)}
                  className="bg-green-500 text-white font-semibold p-1 px-2 rounded-md"
                >
                  Ordered
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OutOfStockGroceries;
