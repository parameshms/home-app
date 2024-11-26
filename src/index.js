import appStore from "./constants/appStore";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import HomePage from "./components/Homepage";
import BrowserErrorPage from "./components/BrowserErrorPage";
import RoomControls from "./components/RoomControls";
import EnergyConsuption from "./components/EnergyConsuption";
import ScrollToTop from "./constants/ScrollToTopPage";
import { Provider } from "react-redux";


import HousehelpDetailsPage from "./components/HouseHelp/Househelp";
import Register from "./components/Register";
import AddGroceries from "./components/HouseHelp/AddGroceries";
import OutOfStockGroceries from "./components/GetGroceries";
import PageViewsBarChart from "./components/PageViewsBarChart";
import AddFamily from "./components/AddFamily";
import ApprovalPending from "./components/ApprovalPending";
import UtilitiesPage from "./components/UtilitiesPage";
import GasConsumption from "./components/GasConsumption";
import WaterConsumption from "./components/WaterConsumption";
import Reminders from "./components/Reminders";
import AddHousehelp from "./components/HouseHelp/AddHousehelp";


const useAuth = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  return { token, role };
};

const ProtectedRoute = ({ element, roleRequired, ...rest }) => {
  const { token, role } = useAuth();

  if (!token) {
    return <Navigate to="/" replace />;
  }


  if (roleRequired && role !== roleRequired) {
  
    if (role === "maid" || role === "Cook") {
      return <Navigate to="/AddGroceries" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return element;
};

const Root = () => {
  const [isMobile, setIsMobile] = useState(
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  );
  const [isPortrait, setIsPortrait] = useState(
    window.innerWidth < window.innerHeight
  );

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerWidth < window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {isMobile ? (
          isPortrait ? (
            <>
              {/* <Route path="/" element={<App/>} /> */}
              {localStorage.getItem("token") ? (
                <Route path="/" element={<Navigate to="/home" replace />} />
              ) : (
                <Route path="/" element={<App />} />
              )}
              <Route path="/register" element={<Register />} />
              <Route path="/chart" element ={<PageViewsBarChart/>}/>

              
              <Route path="/AddGroceries" element={<AddGroceries />} />

              <Route path="/Addfamily" element={<AddFamily />} />
              <Route path="/approval" element={<ApprovalPending />} />
              <Route path="/utilities" element={<UtilitiesPage/>} />
              <Route path="/reminders" element = {<Reminders/>}/>
              <Route path="/addHouseHelps" element = {<AddHousehelp/>}/>

              {/* Owner-only routes */}
              <Route
                path="/home"
                element={<ProtectedRoute element={<HomePage />} roleRequired="Owner" />}
              />
              <Route
                path="/househelp/:role"
                element={<ProtectedRoute element={<HousehelpDetailsPage />} roleRequired="Owner" />}
              />
              <Route
                path="/groceries/out_of_stock"
                element={<ProtectedRoute element={<OutOfStockGroceries />} roleRequired="Owner" />}
              />
            
              <Route
                path="/househelps"
                element={<RoomControls />}
              />
              <Route
                path="/electricity"
                element={<EnergyConsuption />}
              />
              <Route
                path="/gas"
              element={<GasConsumption />}
              />
              <Route
                path="/water"
                element={<ProtectedRoute element={< WaterConsumption/>} roleRequired="Owner" />}
              />
          
            </>
          ) : (
            <Route path="*" element={<BrowserErrorPage />} />
          )
        ) : (
          <Route path="*" element={<BrowserErrorPage />} />
        )}
      </Routes>
    </Router>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.createRoot(rootElement).render(
  <Provider store={appStore}>
    <Root />
  </Provider>
);

serviceWorkerRegistration.unregister();
reportWebVitals();
