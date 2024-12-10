import { Link } from "react-router-dom";
import leftArrowIcon from "../assests/leftArrow.svg";

import bulb from "../assests/bulb.jpg"
import gas from "../assests/gas.png"
import water from "../assests/water.jpg"
import newspaper from "../assests/newspaper.jpg"

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
        alt="Back"
        onClick={handleBackButtonClick}
        className="w-10 h-10 cursor-pointer mb-6 "
      />
          <h3 className="text-2xl font-bold mb-4">Utilities</h3>
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

            <Link to="/newspaper">
              <div className="flex justify-between items-center px-9 py-7 border-2 shadow-md rounded-xl bg-white hover:bg-[#819b9b]">
                <div className="text-[18px] w-24 font-medium tracking-wider">
                  Newspaper
                </div>
                <img src={newspaper} alt="" className="w-40 h-36" />
              </div>
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderFoodPage;
