import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, TextField, Button, Stack } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import leftArrowIcon from "../assests/leftArrow.svg";

const WaterConsumption = () => {
  const [consumptionData, setConsumptionData] = useState([]);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newWaterData, setNewWaterData] = useState({
    readingDate: "",
    dueDate: "",
    consumptionInLtrs: "",
    waterCharges: "",
    otherCharges: "",
    totalAmount: "",
  });

  const theme = useTheme();
  const colorPalette = [(theme.vars || theme).palette.primary.light];
  const API = process.env.REACT_APP_API;
  const navigate = useNavigate();

  const fetchConsumptionData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${API}/waterConsumption/last_three_months`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data || [];
      setConsumptionData(data);
      if (data.length) formatGraphData(data);
    } catch (error) {
      setError("Error fetching water consumption data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsumptionData();
  }, [API]);

  const handleAddData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(`${API}/waterConsumption/addData`, newWaterData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 201) {
       
        await fetchConsumptionData();
        resetForm();
        setShowForm(false);
      } else {
        setError("Failed to add water consumption data.");
      }
    } catch (error) {
      setError("Error adding water consumption data.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWaterData((prevData) => ({ ...prevData, [name]: value }));
  };

  const formatGraphData = (data) => {
    const labels = data.map((entry) =>
      entry.reading_date ? new Date(entry.reading_date).toLocaleDateString() : "N/A"
    );
    const consumptions = data.map((entry) => entry.consumption_liters || 0);

    setGraphData({
      labels: labels,
      datasets: [
        {
          label: "Consumption (Liters)",
          data: consumptions,
          backgroundColor: colorPalette,
        },
      ],
    });
  };

  const resetForm = () => {
    setNewWaterData({
      readingDate: "",
      dueDate: "",
      consumptionInLtrs: "",
      waterCharges: "",
      otherCharges: "",
      totalAmount: "",
    });
  };

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  const renderConsumptionTable = () => {
    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    if (!consumptionData.length) {
      return (
        <Typography>No data available. Please add new water consumption data.</Typography>
      );
    }

    return (
      <table style={{ width: "100%", marginTop: "16px", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "2px solid #ddd", padding: "8px", textAlign: "left" }}>Reading Date</th>
            <th style={{ borderBottom: "2px solid #ddd", padding: "8px", textAlign: "left" }}>Due Date</th>
            <th style={{ borderBottom: "2px solid #ddd", padding: "8px", textAlign: "left" }}>
              Total Consumption (Ltrs)
            </th>
            <th style={{ borderBottom: "2px solid #ddd", padding: "8px", textAlign: "left" }}>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {consumptionData.map((data) => (
            <tr key={data._id}>
              <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                {new Date(data.reading_date).toLocaleDateString()}
              </td>
              <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                {new Date(data.due_date).toLocaleDateString()}
              </td>
              <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                {data.consumption_liters}
              </td>
              <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                {data.total_amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <img
        src={leftArrowIcon}
        alt="Back"
        onClick={handleBackButtonClick}
        className="w-10 h-10 cursor-pointer mb-6"
      />
      <Typography variant="h6" gutterBottom>
        Water Consumption Details
      </Typography>

     

      {showForm && (
        <Card sx={{ margin: "16px 0", padding: "16px" }}>
          <CardContent>
            <TextField
              label="Reading Date"
              name="readingDate"
              fullWidth
              value={newWaterData.readingDate}
              onChange={handleInputChange}
              margin="normal"
              type="date"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Due Date"
              name="dueDate"
              fullWidth
              value={newWaterData.dueDate}
              onChange={handleInputChange}
              margin="normal"
              type="date"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Consumption in Liters"
              name="consumptionInLtrs"
              fullWidth
              value={newWaterData.consumptionInLtrs}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              label="Water Charges"
              name="waterCharges"
              fullWidth
              value={newWaterData.waterCharges}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              label="Other Charges"
              name="otherCharges"
              fullWidth
              value={newWaterData.otherCharges}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              label="Total Amount"
              name="totalAmount"
              fullWidth
              value={newWaterData.totalAmount}
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

      {consumptionData.length > 0 && graphData && (
        <Card variant="outlined" sx={{ width: "100%", mt: 2 }}>
          <CardContent>
            <Typography component="h2" variant="subtitle2" gutterBottom>
              Monthly Water Consumption
            </Typography>
            <BarChart
              borderRadius={8}
              colors={colorPalette}
              xAxis={[{ scaleType: "band", data: graphData.labels }]}
              series={[{ id: "total-consumption", label: "Consumption (Ltrs)", data: graphData.datasets[0].data }]}
              height={250}
              margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
              grid={{ horizontal: true }}
              slotProps={{ legend: { hidden: true } }}
            />
          </CardContent>
        </Card>
      )}

<div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
        <Button variant="contained" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close Form" : "Add New Water Data"}
        </Button>
      </div>
    </div>
  );
};

export default WaterConsumption;
