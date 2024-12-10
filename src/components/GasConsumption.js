
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, TextField, Button, Chip, Stack, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import leftArrowIcon from "../assests/leftArrow.svg";
import { useNavigate } from 'react-router-dom';

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const GasConsumption = () => {
  const [consumptionData, setConsumptionData] = useState([]);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateError, setDateError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const navigate = useNavigate();

  const [newGasData, setNewGasData] = useState({
    billNumber: "",
    consumerNo: "",
    deliveredDate: "",
    totalWeight: "",
    amount: ""
  });

  const theme = useTheme();
  const colorPalette = [(theme.vars || theme).palette.primary.light];
  const API = process.env.REACT_APP_API;

  const fetchConsumptionData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${API}/gas_consumption/last_three_months`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.error && response.data.error === "No gas consumption records found for the last three months") {
        setError("No data available for the last three months.");
      } else {
        setConsumptionData(response.data);
     
      }
    } catch (error) {
      console.error("Error fetching gas data:", error);
      setError("No Data available..");
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyDaysData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${API}/gas_consumption/monthly_days`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data)
      formatGraphData(response.data);
    } catch (error) {
      console.error("Error fetching monthly days data:", error);
      setError("No data available for monthly days.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsumptionData();
    fetchMonthlyDaysData();
  }, []);

  const handleAddData = async () => {
    setError("");
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(`${API}/gasConsumption/addData`, newGasData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConsumptionData((prevData) => [...prevData, response.data]);
      
      setSuccessMessage("Data added successfully!");
      setSnackbarOpen(true);
      setShowForm(false);
      
      setNewGasData({ deliveredDate: "", totalWeight: "", amount: "" });
      fetchConsumptionData();
    
    } catch (error) {
      setError(error.response?.data?.error || error.message)
      console.error("Error adding gas data:", error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "deliveredDate") {
      const today = new Date();
      const selectedDate = new Date(value);
      if (selectedDate > today) {
        setDateError("Delivered date cannot be in the future.");
      } else {
        setDateError("");
      }
    }

    setNewGasData((prevData) => ({ ...prevData, [name]: value }));
  };
  const formatGraphData = (data) => {
    const months = data.map((entry) => entry.month);
    const daysConsumed = data.map((entry) => entry.days_consumed);
    setGraphData({
      labels: months,
      datasets: [{ label: "Days Consumed", data: daysConsumed, backgroundColor: colorPalette }],
    });
  };

  const renderConsumptionTable = () => {
    if (loading) return <div>Loading...</div>;

    if (error) return <div>{error}</div>;

    if (!consumptionData.length) return <div>No data available</div>;

    return (
      <table style={{ width: "100%", marginTop: "16px" }}>
        <thead>
          <tr>
            <th>Delivered Date</th>
            <th>Total Weight (kg)</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {consumptionData.map((data) => (
            <tr key={data._id}>
              <td>{new Date(data.delivered_date).toLocaleDateString()}</td>
              <td>{data.total_weight}</td>
              <td>{data.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const handleBackButtonClick = () => {
    window.history.back();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <img
              src={leftArrowIcon}
              alt="Back"
              onClick={handleBackButtonClick}
              className="w-10 h-10 cursor-pointer mb-6"
            />
      <Typography variant="h6" gutterBottom>Gas Consumption Details</Typography>

      {showForm && (
        <Card sx={{ margin: "16px 0", padding: "16px" }}>
          <CardContent>
            <TextField
              label="Delivered Date"
              type="date"
              name="deliveredDate"
              fullWidth
              value={newGasData.deliveredDate}
              onChange={handleInputChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              error={Boolean(dateError)}
              helperText={dateError}
            />
            <TextField
              label="Total Weight"
              name="totalWeight"
              fullWidth
              value={newGasData.totalWeight}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              label="Amount"
              name="amount"
              fullWidth
              value={newGasData.amount}
              onChange={handleInputChange}
              margin="normal"
            />
            <Button
              variant="contained"
              onClick={handleAddData}
              sx={{ marginTop: "16px" }}
              disabled={Boolean(dateError)}
            >
              Submit
            </Button>
          </CardContent>
        </Card>
      )}

      {renderConsumptionTable()}


{graphData && (
  <Card variant="outlined" sx={{ width: "100%", mt: 2, position: "relative" }}>
    <CardContent>
      <Typography component="h2" variant="subtitle2" gutterBottom>
        Days Consumed Per Month
      </Typography>
      <div style={{ position: "relative", height: "300px" }}>
        <BarChart
          borderRadius={8}
          colors={colorPalette}
          xAxis={[{ scaleType: "band", data: graphData.labels }]}
          series={[{ id: "days-consumed", label: "Days Consumed", data: graphData.datasets[0].data }]}
          height={250}
          margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          slotProps={{ legend: { hidden: true } }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          {/* Render labels on top of bars */}
          {graphData.datasets[0].data.map((value, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                top: `${40 + index * 5}px`,
                left: `${80 + index * 80}px`, 
                transform: "translate(-50%, -100%)",
                textAlign: "center",
                fontSize: "12px",
                fontWeight: "bold",
                color: theme.palette.text.primary,
              }}
            >
              {value} days
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
)}



      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
        <Button variant="contained" onClick={() => setShowForm(true)}>
          Add New Gas Data
        </Button>
      </div>


      <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity="success">
            {successMessage}
          </Alert>
        </Snackbar>

        {error && (
          <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={() => setError("")}
          >
            <Alert onClose={() => setError("")} severity="error">
              {error}
            </Alert>
          </Snackbar>
        )}




    </div>
  );
};

export default GasConsumption;

