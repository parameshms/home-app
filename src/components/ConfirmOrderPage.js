import { Link } from "react-router-dom";
import leftArrowIcon from "../assests/leftArrow.svg";
import AddedItemPage from "./AddedItemPage";
import { useDispatch, useSelector } from "react-redux";
import { setOrderData } from "../constants/orderDataSlice";
import { useEffect, useState } from "react";
import { placeFoodOrderApi } from "../apis/inRoomDiningApi";

const ConfirmOrderPage = () => {
  const [placedOrderData, setPlacedOrderData] = useState(null);
  const orderData = useSelector((store) => store.orderItems.orderData);
  const [totalPrice, setTotalPrice] = useState(0);
  const hotel_name = localStorage.getItem("hotel_name");
  const rhid = localStorage.getItem("rhid");
  const dispatch = useDispatch();
  useEffect(() => {
    const tPrice = orderData.reduce((acc, curr) => {
      acc += curr?.price * curr?.quantity;
      return acc;
    }, 0);
    setTotalPrice(tPrice);
  }, [orderData]);
  const handleBackButtonClick = () => {
    window.history.back();
  };
  const handleAddItem = (itemName) => {
    const updatedData = orderData.map((item) => {
      if (item.name.includes(itemName)) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    dispatch(setOrderData(updatedData));
  };
  const handleRemoveItem = (itemName) => {
    const updatedData = orderData.map((item) => {
      if (item.name.includes(itemName)) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    dispatch(setOrderData(updatedData));
  };
  const handlePlaceOrder = (data) => {
    const fetchData = async () => {
      const payload = {
        rhid: rhid,
        items: data.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
        })),
      };
      try {
        const result = await placeFoodOrderApi(payload, hotel_name);
        setPlacedOrderData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    };
    fetchData();
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
          <h2 className="font-semibold text-[18px]">Confirm Order</h2>
        </div>
        <div className="p-2 m-2 mt-3">
          <div className="flex flex-col p-4 border-0 bg-[#FEF8D9] rounded-xl text-[12px] flex-wrap font-light leading-6 tracking-wider hover:bg-[#819b9b] gap-2 mb-10">
            This is a In-Room order, so we’ll deliver your food to your room.
          </div>
          <div className="py-4 flex flex-col gap-4">
            {orderData.map((data, orderIndex) => {
              return data.quantity > 0 ? (
                <AddedItemPage
                  key={orderIndex}
                  data={data}
                  handleAddItem={handleAddItem}
                  handleRemoveItem={handleRemoveItem}
                />
              ) : null;
            })}
          </div>
          <div className="pt-16 border-y">
            <div className="flex justify-between text-[14px]">
              <div>Item total</div>
              <div>₹ {totalPrice}</div>
            </div>
            <div className="flex justify-between text-[14px]">
              <div>Taxes & Charges</div>
              <div>₹ 0</div>
            </div>
            <div className="py-4 flex justify-between border-t text-[18px] font-[600]">
              <div>Grand Total</div>
              <div>₹ {totalPrice}</div>
            </div>
          </div>
          <div className="py-7 border-b mb-5">
            <div className="text-[14px] font-light text-gray-500">
              Need cutlery or others?
            </div>
            <input
              className="text-[14px]"
              placeholder="Leave a comment..."
              value=""
            />
          </div>
          <div className="flex flex-col gap-4">
            <Link to="ordersuccess">
              <div
                className="bottom-2 bg-[#3D6464] text-white font-base px-4 py-2 text-center border rounded-lg shadow-xl"
                onClick={() => handlePlaceOrder(orderData)}
              >
                <div className="text-[16px] tracking-wider">Pay On Service</div>
              </div>
            </Link>
            <Link to="ordersuccess">
              <div
                className="bottom-2 bg-white text-black font-base px-4 py-2 text-center border border-black rounded-lg shadow-xl"
                onClick={() => handlePlaceOrder(orderData)}
              >
                <div className="text-[16px] tracking-wider">Add To Tab</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrderPage;
