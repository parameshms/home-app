import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme } from "@mui/material/styles";
import TextField from '@mui/material/TextField';

const WaterConsumption = () => {
  const [consumptionData, setConsumptionData] = useState([]);
  const [graphData, setGraphData] = useState(null);
  const [showForm, setShowForm] = useState(false);
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

  const theme = useTheme();
  const API = process.env.REACT_APP_API;

  useEffect(() => {
    const fetchConsumptionData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${API}/water_consumption/last_three_months`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConsumptionData(response.data || []);
        formatGraphData(response.data || []);
        console.log(response)
      } catch (error) {
        console.error("Error fetching water data:", error);
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
      console.error("Error adding water data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWaterData((prevData) => ({ ...prevData, [name]: value }));
  };

  const formatGraphData = (data) => {
    if (data && data.length > 0) {
      const dates = data.map((entry) => entry.reading_date ? new Date(entry.reading_date).toLocaleDateString() : "N/A");
      const consumptions = data.map((entry) => entry.consumption_liters || 0);
      setGraphData({
        labels: dates,
        datasets: [
          {
            label: "Consumption (Liters)",
            data: consumptions,
            backgroundColor: theme.palette.primary.main,
          },
        ],
      });
    } else {
      setGraphData({
        labels: [],
        datasets: [
          {
            label: "Consumption (Liters)",
            data: [],
          },
        ],
      });
    }
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

      {consumptionData && consumptionData.length > 0 ? (
        <>
          <Card sx={{ marginTop: "16px" }}>
            <CardContent>
              <Typography variant="h6">Water Consumption Data</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>RR Number</TableCell>
                      <TableCell>Consumer Number</TableCell>
                      <TableCell>Bill Number</TableCell>
                      <TableCell>Reading Date</TableCell>
                      <TableCell>Consumption (Liters)</TableCell>
                      <TableCell>Water Charges</TableCell>
                      <TableCell>Total Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {consumptionData.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell>{data?.RR_number || "N/A"}</TableCell>
                        <TableCell>{data?.consumer_number || "N/A"}</TableCell>
                        <TableCell>{data?.bill_number || "N/A"}</TableCell>
                        <TableCell>{data?.reading_date ? new Date(data.reading_date).toLocaleDateString() : "N/A"}</TableCell>
                        <TableCell>{data?.consumption_liters || 0}</TableCell>
                        <TableCell>{data?.water_charges || 0}</TableCell>
                        <TableCell>{data?.total_amount || 0}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {graphData && graphData.labels.length > 0 && graphData.datasets[0].data.length > 0 && (
            <Card sx={{ marginTop: "16px" }}>
              <CardContent>
                <Typography variant="h6">Water Consumption Chart</Typography>
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
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Typography variant="body1">No data available.</Typography>
      )}
    </div>
  );
};

export default WaterConsumption;
