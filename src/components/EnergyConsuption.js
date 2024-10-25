
import React, { useEffect, useState } from "react";
import leftArrowIcon from "../assests/leftArrow.svg"; 
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import axios from "axios";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';



const EnergyConsumption = () => {
  const [consumptionData, setConsumptionData] = useState([]);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newEnergyData, setNewEnergyData] = useState({
    RR_No: "",
    accId: "",
    address: "",
    billPeriod: "",
    readingDate: "",
    billNumber: "",
    consumptionDetails: {
      presentReading: "",
      previousReading: "",
      unitsConsumed: "",
      billForConsumedUnits: {
        fixedCharges: { unit: "", rate: "", amount: "" },
        energyCharges: { unit: "", rate: "", amount: "" },
        FPPCACharges: { unit: "", rate: "", amount: "" },
        tax: { rate: "", Amount: "" },
      },
    },
    additionalCharges: { pfPenalty: "", interest: "" },
    NetPayable: "",
    BillDueDate: "",
    
  });


  const theme = useTheme();
  const colorPalette = [
    // (theme.vars || theme).palette.primary.dark,
    // (theme.vars || theme).palette.primary.main,
    (theme.vars || theme).palette.primary.light,
  ];

  useEffect(() => {
    const fetchConsumptionData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://127.0.0.1:5053/get_last_three_months", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.error) {
          setError(data.message || "Failed to load data");
        } else {
          setConsumptionData(data);
          formatGraphData(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch energy consumption data.");
      } finally {
        setLoading(false);
      }
    };

    fetchConsumptionData();
  }, []);

  const handleAddData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://127.0.0.1:5053/energyConsumption/addData",
        newEnergyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setConsumptionData((prevData) => [...prevData, response.data]); // Add new data to the list
      setShowForm(false); // Hide the form after adding
      setNewEnergyData({ // Reset the form
        RR_No: "",
        accId: "",
        address: "",
        billPeriod: "",
        readingDate: "",
        billNumber: "",
        consumptionDetails: {
          presentReading: "",
          previousReading: "",
          unitsConsumed: "",
          billForConsumedUnits: {
            fixedCharges: { unit: "", rate: "", amount: "" },
            energyCharges: { unit: "", rate: "", amount: "" },
            FPPCACharges: { unit: "", rate: "", amount: "" },
            tax: { rate: "", Amount: "" },
          },
        },
        additionalCharges: { pfPenalty: "", interest: "" },
        NetPayable: "",
        BillDueDate: "",
        
      });
    } catch (error) {
      console.error("Error creating energy consumption data:", error);
      setError("Failed to add energy consumption data.");
    }
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

  const renderConsumption = () => {
    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    if (!consumptionData || consumptionData.length === 0) {
      return (
        <div className="text-center">
          <p>No Data found</p>
          <button
            type="button"
            className="text-white bg-slate-400 focus:ring-1 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={() => setShowForm(true)}
          >
            Add Data
            <svg
              className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </button>
        </div>
      );
    }

    return (
      <table className="table-auto w-full text-left">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">Acc ID</th>
            <th className="px-4 py-2">Reading Date</th>
            <th className="px-4 py-2">Units Consumed</th>
          </tr>
        </thead>
        <tbody>
          {consumptionData.map((bill, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2">{bill.accId}</td>
              <td className="px-4 py-2">
                {new Date(bill.readingDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">
                {bill.consumptionDetails.unitsConsumed}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div style={{padding:"20px"}}>
    <div className="flex min-h-full flex-1 flex-col justify-center font-poppins">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-6 p-2">
        <div className="min-h-full font-poppins tracking-wide flex gap-6 p-2 items-center">
          <img
            src={leftArrowIcon}
            alt="Back"
            className="cursor-pointer"
            onClick={handleBackButtonClick}
          />
          <h2 className="font-semibold text-[18px]">
            Your Energy Consumption Details over last 3 months
          </h2>
        </div>

        {renderConsumption()}

        <div className="flex justify-end">
          <button
            type="button"
            className="text-white bg-slate-400 focus:ring-1 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={() => setShowForm(true)}
          >
            Add Data
            <svg
              className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </button>
        </div>
      </div>
      <div style={{padding:"20px"}}>
      {showForm && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="RR_No"
                    value={newEnergyData.userId}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full"
                    placeholder="RR No"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="accId"
                    value={newEnergyData.accId}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full"
                    placeholder="Account ID"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="address"
                    value={newEnergyData.address}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full"
                    placeholder="Address"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="billPeriod"
                    value={newEnergyData.billPeriod}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full"
                    placeholder="Bill Period"
                    required
                  />
                </div>
                <div>
                  <label>Reading Date</label>
                  <input
                    type="date"
                    name="readingDate"
                    value={newEnergyData.readingDate}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full"
                    placeholder="Reading Date"
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
                    placeholder="Bill Due Date"
                    required
                  />
                </div>

                <div>
                  <input
                    type="text"
                    name="billNumber"
                    value={newEnergyData.billNumber}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full"
                    placeholder="Bill Number"
                    required
                  />
                </div>
                <div>
                  <input
                    type="number"
                    name="consumptionDetails.presentReading"
                    value={newEnergyData.consumptionDetails.presentReading}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full"
                    placeholder="Present Reading"
                    required
                  />
                </div>
                <div>
                  <input
                    type="number"
                    name="consumptionDetails.previousReading"
                    value={newEnergyData.consumptionDetails.previousReading}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full"
                    placeholder="Previous Reading"
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

                <div>
                  <input
                    type="number"
                    name="consumptionDetails.NetPayable"
                    value={newEnergyData.consumptionDetails.NetPayable}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full"
                    placeholder="Net Payable"
                    required
                  />
                </div>


                

               
                
                <div className="col-span-2">
                  <button
                    type="button"
                    onClick={handleAddData}
                    className="bg-blue-500 text-white p-2 rounded w-full"
                  >
                    Add Energy Data
                  </button>
                </div>
              </div>
            )}
            </div>

      
        
      {graphData && (
        <>
        {/* <div className="mt-8">
          <h3 className="text-lg font-semibold">Energy Consumption Graph</h3>
          <Line data={graphData} />
        </div> */}
       
        <Card variant="outlined" sx={{ width: '100%', mt: 2 }}>
              <CardContent>
                <Typography component="h2" variant="subtitle2" gutterBottom>
                  Monthly Energy Consumption
                </Typography>
                <Stack sx={{ justifyContent: 'space-between', mb: 2 }}>
                  <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                    <Typography variant="h4" component="p">
                      {graphData.datasets[0].data[graphData.datasets[0].data.length - 1]}
                    </Typography>
                    <Chip size="small" color="error" label="+8% ^" />
                  </Stack>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Units consumed in the last month
                  </Typography>
                </Stack>
                <BarChart
                  borderRadius={8}
                  colors={colorPalette}
                  xAxis={[
                    {
                      scaleType: 'band',
                      data: graphData.labels,
                    },
                  ]}
                  series={[
                    {
                      id: 'units-consumed',
                      label: 'Units Consumed',
                      data: graphData.datasets[0].data,
                    },
                  ]}
                  height={250}
                  margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
                  grid={{ horizontal: true }}
                  slotProps={{
                    legend: {
                      hidden: true,
                    },
                  }}
                />
              </CardContent>
            </Card>
        
     
    
    </>
      )}
    </div>
    </div>
  );
};

export default EnergyConsumption;

