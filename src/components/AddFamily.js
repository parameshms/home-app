import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddFamilyPage = () => {
  const API = process.env.REACT_APP_API;
  const token = localStorage.getItem('token');
  const [familyMembers, setFamilyMembers] = useState([]);
  const [members, setMembers] = useState([]);
  const [familyMembersError, setFamilyMembersError] = useState('');
  const [membersError, setMembersError] = useState('');

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
      setFamilyMembersError(error.response?.data?.message || "Failed to load family members");
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
      setMembersError(error.response?.data?.message || "Failed to load members");
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

      // Optimistically update UI for both lists
      setFamilyMembers((prevMembers) =>
        prevMembers.map((member) =>
          member._id === memberId ? { ...member, isApproved: status === 'approved' } : member
        )
      );
      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member._id === memberId ? { ...member, isApproved: status === 'approved' } : member
        )
      );
    } catch (error) {
      setFamilyMembersError('Failed to approve/reject family member');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Pending Family Members</h2>
      {familyMembersError && <p className="text-red-500 mb-4">{familyMembersError}</p>}

      <ul className="w-full max-w-md bg-white shadow-md rounded-lg p-4 space-y-4 mb-8">
        {familyMembers.map((member) => (
          <li key={member.email} className="flex items-center p-4 border-b border-gray-200">
            <div>
              <p className="text-lg font-medium text-gray-900">{member.firstname}</p>
              <p className="text-gray-600">{member.email}</p>
            </div>
            <div className="ml-auto flex flex-col space-y-2">
              {member.isApproved ? (
                <button className="px-4 py-2 bg-green-400 text-white rounded-md cursor-not-allowed" disabled>
                  Approved
                </button>
              ) : member.isApproved === false ? (
                <button className="px-4 py-2 bg-red-400 text-white rounded-md cursor-not-allowed" disabled>
                  Rejected
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleStatus(member._id, 'approved')}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatus(member._id, 'rejected')}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      <h2 className="text-3xl font-semibold text-gray-800 mb-6">All Family Members</h2>
      {membersError && <p className="text-red-500 mb-4">{membersError}</p>}

      <ul className="w-full max-w-md bg-white shadow-md rounded-lg p-4 space-y-4">
        {members.map((member) => (
          <li key={member.email} className="flex items-center p-4 border-b border-gray-200">
            <div>
              <p className="text-lg font-medium text-gray-900">{member.firstname}</p>
              <p className="text-gray-600">{member.email}</p>
            </div>
            <div className="ml-auto flex flex-col space-y-2">
              
                  <button
                    onClick={() => handleStatus(member._id, 'pending')}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Remove
                  </button>
           
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddFamilyPage;
