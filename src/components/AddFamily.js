import React, { useState, useEffect } from 'react';
import axios from 'axios';
import leftArrowIcon from "../assests/leftArrow.svg";
import { useNavigate } from 'react-router-dom';

const AddFamilyPage = () => {
  const API = process.env.REACT_APP_API;
  const token = localStorage.getItem('token');
  const [familyMembers, setFamilyMembers] = useState([]);
  const [members, setMembers] = useState([]);
  const [familyMembersError, setFamilyMembersError] = useState('');
  const [membersError, setMembersError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchFamilyMembers();
    fetchMembers();
  }, []);

  const fetchFamilyMembers = async () => {
    try {
      const response = await axios.get(`${API}/getPendingMembers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const pendingMembers = response.data.members || [];
      if (pendingMembers.length === 0) {
        setFamilyMembersError(response.data.message || "No pending family members found.");
      } else {
        setFamilyMembers(pendingMembers);
        setFamilyMembersError('');
      }
    } catch (error) {
      setFamilyMembersError(error.response?.data?.message || "Failed to load family members.");
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await axios.get(`${API}/getMembers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const allMembers = response.data.members || [];
      if (allMembers.length === 0) {
        setMembersError(response.data.message || "No family members found.");
      } else {
        setMembers(allMembers);
        setMembersError('');
      }
    } catch (error) {
      setMembersError(error.response?.data?.message || "Failed to load members.");
    }
  };

  const handleStatus = async (memberId, status) => {
    try {
      await axios.put(
        `${API}/familyMembers/updateStatus`,
        { memberId, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFamilyMembers((prevMembers) =>
        prevMembers.filter((member) => member._id !== memberId)
      );
    

      if (status === "approved") {
        const approvedMember = familyMembers.find((member) => member._id === memberId);
        setMembers((prevMembers) => [...prevMembers, { ...approvedMember, isApproved: true }]);
      }
    } catch (error) {
      setFamilyMembersError("Failed to approve/reject family member.");
    }
  };

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <img
        src={leftArrowIcon}
        alt="Back"
        onClick={handleBackButtonClick}
        className="w-10 h-10 cursor-pointer mb-6 mr-80"
      />

      {familyMembers.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pending Family Members</h2>
          <ul className="w-full max-w-md bg-white shadow-md rounded-lg p-4 space-y-4 mb-8">
            {familyMembers.map((member) => (
              <li key={member.email} className="flex items-center p-4 border-b border-gray-200">
                <div>
                  <p className="text-lg font-medium text-gray-900">{member.firstname}</p>
                  <p className="text-gray-600">{member.email}</p>
                </div>
                <div className="ml-auto flex flex-col space-y-2">
                  <button
                    onClick={() => handleStatus(member._id, "approved")}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatus(member._id, "rejected")}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {members.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Family Members</h2>
          <ul className="w-full max-w-md bg-white shadow-md rounded-lg p-4 space-y-4">
            {members.map((member) => (
              <li key={member.email} className="flex items-center p-4 border-b border-gray-200">
                <div>
                  <p className="text-lg font-medium text-gray-900">{member.firstname}</p>
                  <p className="text-gray-600">{member.email}</p>
                </div>
                <div className="ml-auto">
                  <button
                    onClick={() => handleStatus(member._id, "pending")}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      {familyMembers.length === 0 && members.length === 0 && (
  <div className="flex justify-center items-center w-full h-56 bg-gray-200 rounded-lg shadow-md mt-6">
    <p className="text-gray-600 text-xl font-semibold">Family members not added</p>
  </div>
)}

      {/* {familyMembersError && <p className="text-black mt-4">{familyMembersError}</p>} */}
      {/* {membersError && <p className="text-red-500 mt-4">{membersError}</p>} */}
    </div>
  );
};

export default AddFamilyPage;
