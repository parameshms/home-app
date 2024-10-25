import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); 

  const isAuthenticated = token !== null;

 
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (role === 'Owner') {
    return <Navigate to="/home" />;
  } else if (role === 'Maid' || role === 'Cook') {
    return <Navigate to="/AddGroceries" />;
  }

 
  return <Component {...rest} />;
};

export default PrivateRoute;
