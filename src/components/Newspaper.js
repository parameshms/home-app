
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, TextField, Button, Chip, Stack } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import leftArrowIcon from "../assests/leftArrow.svg";
import { useNavigate } from 'react-router-dom';

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const Newspaper = () => {
  const [consumptionData, setConsumptionData] = useState([]);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); 
  const [successMessage, setSuccessMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);


  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const [newData, setNewData] = useState({
    newspaper_name: "",
    bill_date: "",
    amount: "",
  });

  const theme = useTheme();
  const colorPalette = [(theme.vars || theme).palette.primary.light];
  const API = process.env.REACT_APP_API;

  const fetchConsumptionData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${API}/newspaper/last-three-months`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.data.length === 0) {
        setError("No data available");
      } else {
        setConsumptionData(response.data.data);
        formatGraphData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching newspaper data:", error);
      setError("No data available.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsumptionData();
  }, []);

  const handleAddData = async () => {
    setError("");
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(`${API}/newspaper/add`, newData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if(response.status === 201){
        setSuccessMessage("Data added successfully!");
        setSnackbarOpen(true);
        setShowForm(false);
        setNewData({ newspaper_name: "", bill_date: "", amount: "" });
        fetchConsumptionData();
      } else{
        throw new Error("failed to add data");
      }
      
      
    } catch (error) {
      console.error("Error adding newspaper data:", error);
      setError(error.response?.data?.error || error.message ||"Failed to add data.");
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewData((prevData) => ({ ...prevData, [name]: value }));
  };

  const formatGraphData = (data) => {
    const dates = data.map((entry) => new Date(entry.bill_date).toLocaleDateString());
    const amounts = data.map((entry) => parseFloat(entry.amount));
    setGraphData({
      labels: dates,
      datasets: [{ label: "Expense Amount", data: amounts, backgroundColor: colorPalette }],
    });
  };

  const renderConsumptionTable = () => {
    if (loading) return <div>Loading...</div>;

    if (error) return <div>{error}</div>;

    if (!consumptionData.length) return <div>No data available</div>;

    return (
      <table style={{ width: '100%', marginTop: '16px' }}>
        <thead>
          <tr>
            <th>Newspaper Name</th>
            <th>Bill Date</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {consumptionData.map((data) => (
            <tr key={data._id}>
              <td>{data.newspaper_name}</td>
              <td>{new Date(data.bill_date).toLocaleDateString()}</td>
              <td>{data.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <img
        src={leftArrowIcon}
        alt="Back"
        onClick={handleBackButtonClick}
        className="w-10 h-10 cursor-pointer mb-6 "
      />
      <Typography variant="h6" gutterBottom>Newspaper Expense</Typography>

      {showForm && (
        <Card sx={{ margin: "16px 0", padding: "16px" }}>
          <CardContent>
            <TextField
              label="Newspaper Name"
              name="newspaper_name"
              fullWidth
              value={newData.newspaper_name}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              label="Bill Date"
              type="date"
              name="bill_date"
              fullWidth
              value={newData.bill_date}
              onChange={handleInputChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Amount"
              name="amount"
              fullWidth
              value={newData.amount}
              onChange={handleInputChange}
              margin="normal"
            />
            <Button variant="contained" onClick={handleAddData} sx={{ marginTop: "16px" }}>
              Submit
            </Button>
          </CardContent>
        </Card>
      )}

      {renderConsumptionTable()}

      {graphData && (
        <Card variant="outlined" sx={{ width: '100%', mt: 2 }}>
          <CardContent>
            <Typography component="h2" variant="subtitle2" gutterBottom>Monthly Newspaper Expense</Typography>
            <BarChart
              borderRadius={8}
              colors={colorPalette}
              xAxis={[{ scaleType: 'band', data: graphData.labels }]}
              series={[{ id: 'expense-amount', label: 'Expense Amount', data: graphData.datasets[0].data }]}
              height={250}
              margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
              grid={{ horizontal: true }}
              slotProps={{ legend: { hidden: true } }}
            />
          </CardContent>
        </Card>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
        <Button variant="contained" onClick={() => setShowForm(true)}>
          Add New Newspaper Data
        </Button>

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
    </div>
  );
};

export default Newspaper;
