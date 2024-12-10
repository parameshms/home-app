
import React, { useEffect, useState } from "react";
import leftArrowIcon from "../assests/leftArrow.svg"; 
import { BarChart } from '@mui/x-charts/BarChart';
import axios from "axios";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useTheme } from '@mui/material/styles';

const EnergyConsumption = () => {
  const [consumptionData, setConsumptionData] = useState([]);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const API = process.env.REACT_APP_API;

  const [newEnergyData, setNewEnergyData] = useState({
    readingDate: "",
    consumptionDetails: {
      unitsConsumed: "",
    },
    BillDueDate: "",
  });

  const theme = useTheme();
  const colorPalette = [(theme.vars || theme).palette.primary.light];

  const fetchConsumptionData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API}/get_last_three_months`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setConsumptionData(data);
        formatGraphData(data);
      } else {
        throw new Error(data.error || "Failed to load data.");
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsumptionData();
  }, []);

  const handleAddData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${API}/energyConsumption/addData`,
        newEnergyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setSuccessMessage("Data added successfully!");
        setSnackbarOpen(true);
        setShowForm(false);
        setNewEnergyData({ readingDate: "", consumptionDetails: { unitsConsumed: "" }, BillDueDate: "" });
        fetchConsumptionData();
      } else {
        throw new Error("Failed to add energy consumption data.");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || error.message || "An unexpected error occurred.");
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");
    if (keys.length > 1) {
      setNewEnergyData((prevData) => ({
        ...prevData,
        [keys[0]]: {
          ...prevData[keys[0]],
          [keys[1]]: value,
        },
      }));
    } else {
      setNewEnergyData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const validateReadingDate = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    return selectedDate <= today;
  };

  const formatGraphData = (data) => {
    const months = data.map((bill) => bill.readingDate);
    const unitsConsumed = data.map((bill) => bill.consumptionDetails.unitsConsumed);

    const chartData = {
      labels: months,
      datasets: [
        {
          label: "Units Consumed",
          data: unitsConsumed,
          backgroundColor: colorPalette,
        },
      ],
    };

    setGraphData(chartData);
  };

  const handleBackButtonClick = () => {
    window.history.back();
  };

  return (
    <div style={{ padding: "20px" }}>
      <div className="flex min-h-full flex-1 flex-col justify-center font-poppins">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-6 p-2">
          <div className="min-h-full font-poppins tracking-wide flex gap-6 p-2 items-center">
            <img
              src={leftArrowIcon}
              alt="Back"
              onClick={handleBackButtonClick}
              className="w-10 h-10 cursor-pointer mb-6"
            />
            <h2 className="font-semibold text-[18px]">
              Your Energy Consumption Details over last 3 months
            </h2>
          </div>

          {loading ? (
            <div className="text-center">Loading...</div>
          ) : errorMessage ? (
            <div className="text-center text-red-500">{error}</div>
          ) : consumptionData.length === 0 ? (
            <div className="text-center">
              
              {/* <button
                type="button"
                className="text-white bg-slate-400"
                onClick={() => setShowForm(true)}
              >
                Add Data
              </button> */}
            </div>
          ) : (
            <table className="table-auto w-full text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th>Reading Date</th>
                  <th>Units Consumed</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {consumptionData.map((bill, index) => (
                  <tr key={index}>
                    <td>{new Date(bill.readingDate).toLocaleDateString()}</td>
                    <td>{bill.consumptionDetails.unitsConsumed}</td>
                    <td>{new Date(bill.BillDueDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <button
          type="button"
          className="text-white bg-blue-800 rounded w-28 ml-64 h-8"
          onClick={() => setShowForm(true)}
        >
          Add Data
        </button>

        {showForm && (
          <div className="px-4 py-6 sm:px-8 lg:px-12">
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label>Reading Date</label>
                <input
                  type="date"
                  name="readingDate"
                  value={newEnergyData.readingDate}
                  onChange={(e) => {
                    if (validateReadingDate(e.target.value)) handleInputChange(e);
                  }}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label>Due Date</label>
                <input
                  type="date"
                  name="BillDueDate"
                  value={newEnergyData.BillDueDate}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <input
                  type="number"
                  name="consumptionDetails.unitsConsumed"
                  value={newEnergyData.consumptionDetails.unitsConsumed}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full"
                  placeholder="Units Consumed"
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleAddData}
                className="bg-blue-500 text-white p-3 rounded w-full"
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {graphData && (
          <Card>
            <CardContent>
              <Typography>Monthly Energy Consumption</Typography>
              <BarChart
                colors={colorPalette}
                xAxis={[{  
                  id: 'defaultized-x-axis-0', 
                  scaleType: 'band',
                  data: graphData.labels 
                }]}
                series={[{ id: 'units-consumed', data: graphData.datasets[0].data }]}
                height={250}
              />
            </CardContent>
          </Card>
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity="success">
            {successMessage}
          </Alert>
        </Snackbar>

        {errorMessage && (
          <Snackbar
            open={!!errorMessage}
            autoHideDuration={6000}
            onClose={() => setErrorMessage("")}
          >
            <Alert onClose={() => setErrorMessage("")} severity="error">
              {errorMessage}
            </Alert>
          </Snackbar>
        )}
      </div>
    </div>
  );
};

export default EnergyConsumption;













