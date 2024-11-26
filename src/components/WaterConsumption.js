import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Button, TextField } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme } from "@mui/material/styles";

const WaterConsumption = () => {
  const [consumptionData, setConsumptionData] = useState([]);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const API = process.env.REACT_APP_API;
  const theme = useTheme();


  const colorPalette = [(theme.vars || theme).palette.primary.light || "#3f51b5"];

  const [newWaterData, setNewWaterData] = useState({
    RR_No: "",
    consumerNo: "",
    billNumber: "",
    readingDate: "",
    dueDate: "",
    previousReading: "",
    presentReading: "",
    consumptionInLtrs: "",
    waterCharges: "",
    otherCharges: "",
    totalAmount: "",
  });

  useEffect(() => {
    const fetchConsumptionData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${API}/water_consumption/last_three_months`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data || [];
        setConsumptionData(data);
        formatGraphData(data);
      } catch (error) {
        setError("Error fetching water consumption data.");
      } finally {
        setLoading(false);
      }
    };
    fetchConsumptionData();
  }, [API]);

  const handleAddData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(`${API}/waterConsumption/addData`, newWaterData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConsumptionData((prevData) => [...prevData, response.data]);
      setShowForm(false);
      resetForm();
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
      entry.readingDate ? new Date(entry.readingDate).toLocaleDateString() : "N/A"
    );
    const consumptions = data.map((entry) => entry.consumptionInLtrs || 0);

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
      RR_No: "",
      consumerNo: "",
      billNumber: "",
      readingDate: "",
      dueDate: "",
      previousReading: "",
      presentReading: "",
      consumptionInLtrs: "",
      waterCharges: "",
      otherCharges: "",
      totalAmount: "",
    });
  };

  const renderConsumption = () => {
    if (loading) return <Typography align="center">Loading...</Typography>;
    if (error) return <Typography align="center" color="error">{error}</Typography>;
    if (!consumptionData.length) return <Typography align="center">No data available.</Typography>;

    return (
      <Card sx={{ marginTop: "16px" }}>
        <CardContent>
          <Typography variant="h6">Water Consumption Data</Typography>
          {graphData && (
            <BarChart
              data={graphData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                  },
                },
              }}
              width={600}
              height={300}
            />
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div>
      <Button variant="contained" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Close Form" : "Add New Water Data"}
      </Button>

      {showForm && (
        <Card sx={{ margin: "16px 0", padding: "16px" }}>
          <CardContent>
            {Object.keys(newWaterData).map((field) => (
              <TextField
                key={field}
                label={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                name={field}
                fullWidth
                value={newWaterData[field]}
                onChange={handleInputChange}
                margin="normal"
                type={field.includes("Date") ? "date" : "text"}
                InputLabelProps={field.includes("Date") ? { shrink: true } : {}}
              />
            ))}
            <Button variant="contained" onClick={handleAddData} sx={{ marginTop: "16px" }}>
              Submit
            </Button>
          </CardContent>
        </Card>
      )}

      {renderConsumption()}
    </div>
  );
};

export default WaterConsumption;
