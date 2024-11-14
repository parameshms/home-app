import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ApprovalPending() {
    const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your approval is currently pending...</h2>
        <p className="text-gray-600 mb-6">Please contact home Owner for approval and Check back later.</p>
        
        <button 
          className="mt-4 px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-red-600 transition-colors"
          onClick={() => {
            localStorage.removeItem('flag');
            navigate('/');
          }}
        >
          Back to login
        </button>
      </div>
    </div>
  );
}
