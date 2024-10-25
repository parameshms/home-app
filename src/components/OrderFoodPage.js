import { Link } from "react-router-dom";
import leftArrowIcon from "../assests/leftArrow.svg";
import menuIcon from "../assests/menuIcon.svg";
import dineInIcon from "../assests/dineInIcon.svg";
import reserveTableIcon from "../assests/reserveTableIcon.svg";

const OrderFoodPage = () => {
  const handleBackButtonClick = () => {
    window.history.back();
  };
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center font-poppins scroll-auto">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-6 p-2">
        <div className="min-h-full font-poppins tracking-wide flex gap-6 p-2">
          <img
            src={leftArrowIcon}
            alt=""
            onClick={() => handleBackButtonClick()}
          />
          <h2 className="font-semibold text-[18px]">Order Food</h2>
        </div>
        <div className="p-2 m-2 mt-3">
          <div className="flex flex-col p-3 border-2 rounded-xl bg-white hover:bg-[#819b9b] gap-2 mb-4">
            <div className="flex gap-4 items-center">
              <div className="text-sm font-semibold">Raj Darbaar by DLF</div>
              <div className="text-[10px] text-[#00A91B] font-semibold">
                Open Now
              </div>
            </div>
            <div className="text-[13px] font-medium">
              Timings: 06:00 AM - 01:00 AM
            </div>
          </div>
          <div className="flex flex-col gap-5">
            {/* <Link to="menu">
              <div className="flex justify-between items-center px-9 py-7 pr-12 border-2 shadow-md rounded-xl bg-white hover:bg-[#819b9b]">
                <div className="text-[18px] font-medium tracking-wider">
                  Menu
                </div>
                <img src={menuIcon} alt="" />
              </div>
            </Link> */}
            <Link to="dinning">
              <div className="flex justify-between items-center px-9 py-7 border-2 shadow-md rounded-xl bg-white hover:bg-[#819b9b]">
                <div className="text-[18px] w-24 font-medium tracking-wider">
                  In-Room Dinning
                </div>
                <img src={dineInIcon} alt="" />
              </div>
            </Link>
            {/* <Link to="reserveTable">
              <div className="flex justify-between items-center px-9 py-7 border-2 shadow-md rounded-xl bg-white hover:bg-[#819b9b]">
                <div className="text-[18px] w-24 font-medium tracking-wider">
                  Reserve Table
                </div>
                <img src={reserveTableIcon} alt="" />
              </div>
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderFoodPage;
