import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, TextField, Button, Chip, Stack } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import leftArrowIcon from "../assests/leftArrow.svg";
import { useNavigate } from 'react-router-dom';

const GasConsumption = () => {
  const [consumptionData, setConsumptionData] = useState([]);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

      
      if (response.data.error && response.data.error === "No gas consumption re cords found for the last three months") {
        setError("No data available for the last three months.");
      } else {
        setConsumptionData(response.data);
        formatGraphData(response.data);
      }
    } catch (error) {
      console.error("Error fetching gas data:", error);
      setError("No Data available..");
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
      const response = await axios.post(`${API}/gasConsumption/addData`, newGasData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConsumptionData((prevData) => [...prevData, response.data]);
      fetchConsumptionData();
      setShowForm(false);
      setNewGasData({deliveredDate: "", totalWeight: "", amount: "" });
    } catch (error) {
      console.error("Error adding gas data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGasData((prevData) => ({ ...prevData, [name]: value }));
  };

  const formatGraphData = (data) => {
    const dates = data.map((entry) => new Date(entry.delivered_date).toLocaleDateString());
    const weights = data.map((entry) => parseFloat(entry.total_weight));
    setGraphData({
      labels: dates,
      datasets: [{ label: "Total Weight", data: weights, backgroundColor: colorPalette }],
    });
  };

  const renderConsumptionTable = () => {
    if (loading) return <div>Loading...</div>;

    if (error) return (
      <>
        {/* <div className="text-red-500">{error}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <Button variant="contained" onClick={() => setShowForm(true)}>
            Add New Gas Data
          </Button>
        </div> */}
      </>
    );

    if (!consumptionData.length) return (
      <>
        <div>No data available</div>
       
      </>
    );

    return (
      <>
        <table style={{ width: '100%', marginTop: '16px' }}>
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

      </>
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
            <Typography component="h2" variant="subtitle2" gutterBottom>Monthly Gas Consumption</Typography>
            <Stack sx={{ justifyContent: 'space-between', mb: 2 }}>
              <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                <Typography variant="h4" component="p">
                  {graphData.datasets[0].data[graphData.datasets[0].data.length - 1]}
                </Typography>
                <Chip size="small" color="error" label="+8% ^" />
              </Stack>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Total weight in the last month
              </Typography>
            </Stack>
            <BarChart
              borderRadius={8}
              colors={colorPalette}
              xAxis={[{ scaleType: 'band', data: graphData.labels }]}
              series={[{ id: 'total-weight', label: 'Total Weight (kg)', data: graphData.datasets[0].data }]}
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
            Add New Gas Data
          </Button>
        </div>  
    </div>
  );
};

export default GasConsumption;
