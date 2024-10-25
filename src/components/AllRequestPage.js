import { useEffect } from "react";
import leftArrowIcon from "../assests/leftArrow.svg";
import RequestCard from "./RequestCard";
import { useDispatch, useSelector } from "react-redux";
import { allRequestApi } from "../apis/requestApi";
import { setRequestData } from "../constants/requestDataSlice";
import { formatDate } from "../constants/timeFormatter";
import { useNavigate } from "react-router-dom";

const AllRequestPage = () => {
  const dispatch = useDispatch();
  const requestData = useSelector((store) => store.requestItems.requestData);
  const hotel_name = localStorage.getItem("hotel_name");
  const rhid = localStorage.getItem("rhid");
  const password = localStorage.getItem("password")
  console.log(hotel_name, "Hotel Name");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async (hotel_name) => {
      try {
        const payload = {
          rhid: rhid,
        };
        const data = await allRequestApi(payload, hotel_name);
        dispatch(setRequestData(data.Requests));
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    };
    fetchData(hotel_name);
  }, [dispatch, hotel_name, rhid]);

  const handleBackButtonClick = () => {
    navigate(`/home/${password}`)
  };

  const sortedDatesDescending = (data) => {
    if (!data) return [];

    let sortedData = [...data]?.sort((a, b) => {
      if (a?.requestDay < b?.requestDay) return 1;
      if (a?.requestDay > b?.requestDay) return -1;
      return 0;
    });

    return sortedData;
  };

  console.log(requestData, "RequestData");

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center font-poppins scroll-auto">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-6 p-2">
        <div className="flex justify-between item-center p-2 px-4">
          <div className="min-h-full font-poppins tracking-wide flex gap-5">
            <img
              src={leftArrowIcon}
              alt="Back"
              onClick={handleBackButtonClick}
            />
            <h2 className="font-semibold text-[18px]">My Requests</h2>
          </div>
          <div className="text-[18px] font-medium">Status</div>
        </div>
        <div className="px-4 my-4 h-screen overflow-auto">
          {sortedDatesDescending(requestData)?.map((data, dataIndex) => (
            <div className="border-b-2 border-gray-400" key={dataIndex}>
              {data?.orders?.map((orderData, orderDataIndex) => (
                <RequestCard orderData={orderData} key={orderDataIndex} />
              ))}
              <div className="mt-6 mb-4">
                <div className="text-[18px] font-semibold">
                  Total ₹ {Math.round(data?.cumulativePriceOfDay * 100) / 100}
                </div>
                <div className="text-[14px] text-[#565656]">
                  Based on requests on {formatDate(data?.requestDay)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllRequestPage;
