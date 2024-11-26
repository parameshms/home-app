import { Link } from "react-router-dom";
import leftArrowIcon from "../assests/leftArrow.svg";
import menuIcon from "../assests/menuIcon.svg";
import dineInIcon from "../assests/dineInIcon.svg";
import bulb from "../assests/bulb.jpg"
import reserveTableIcon from "../assests/reserveTableIcon.svg";
import gas from "../assests/gas.png"
import water from "../assests/water.jpg"

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
          <h2 className="font-semibold text-[18px]">Utilities</h2>
        </div>
        <div className="p-2 m-2 mt-3">
         
          <div className="flex flex-col gap-5">
            <Link to="/electricity">
              <div className="flex justify-between items-center px-9 py-7 pr-12 border-2 shadow-md rounded-xl bg-white hover:bg-[#819b9b]">
                <div className="text-[18px] font-medium tracking-wider">
                  Electricity
                </div>
                <img src={bulb} alt="" className="w-40 h-36" />
              </div>
            </Link>
            <Link to="/gas">
              <div className="flex justify-between items-center px-9 py-7 border-2 shadow-md rounded-xl bg-white hover:bg-[#819b9b]">
                <div className="text-[18px] w-24 font-medium tracking-wider">
                  Gas
                </div>
                <img src={gas} alt="" className="w-40 h-36"/>
              </div>
            </Link>
            <Link to="/water">
              <div className="flex justify-between items-center px-9 py-7 border-2 shadow-md rounded-xl bg-white hover:bg-[#819b9b]">
                <div className="text-[18px] w-24 font-medium tracking-wider">
                  Water
                </div>
                <img src={water} alt="" className="w-40 h-36" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderFoodPage;
