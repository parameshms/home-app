import React, { useEffect, useState } from "react";
import leftArrowIcon from "../assests/leftArrow.svg";
// import { menuItemData } from "../constants/menuItemData";
import InRoomDinningItems from "./InRoomDinningItems";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setMenuData, setOrderData } from "../constants/orderDataSlice";
import { inRoomDiningMenuApi } from "../apis/inRoomDiningApi";

const InRoomDinningPage = () => {
  const [addedItems, setAddedItems] = useState([]);
  const dispatch = useDispatch();
  const hotel_name = localStorage.getItem("hotel_name");
  useEffect(() => {
    const fetchData = async (hotel_name) => {
      try {
        const data = await inRoomDiningMenuApi(hotel_name);
        console.log(data, "Food Data");
        dispatch(setMenuData(data));
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    };

    fetchData(hotel_name);
  }, []);
  const menuItemData = useSelector((store) => store.orderItems.menuData);
  const handleBackButtonClick = () => {
    window.history.back();
  };

  const handleItemsAdded = (data) => {
    const existingItemIndex = addedItems.findIndex(
      (item) => item.name === data.name
    );

    if (existingItemIndex !== -1) {
      const updatedItems = addedItems.map((item, index) => {
        if (index === existingItemIndex) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          return item;
        }
      });
      setAddedItems(updatedItems);
      dispatch(setOrderData(updatedItems));
    } else {
      const newItem = { ...data, quantity: 1 };
      const updatedItems = [...addedItems, newItem];
      setAddedItems(updatedItems);
      dispatch(setOrderData(updatedItems));
    }
  };

  const handleItemsRemove = (data) => {
    const existingItemIndex = addedItems.findIndex(
      (item) => item.name === data.name
    );

    if (existingItemIndex !== -1) {
      const updatedItems = addedItems.map((item, index) => {
        if (index === existingItemIndex) {
          const updatedQuantity = item.quantity - 1;
          return {
            ...item,
            quantity: updatedQuantity >= 0 ? updatedQuantity : 0,
          };
        } else {
          return item;
        }
      });

      setAddedItems(updatedItems);
      dispatch(setOrderData(updatedItems));
    }
  };

  return (
    <div className="flex flex-col h-screen font-poppins">
      <div className="sticky top-0 z-10 bg-white shadow-lg p-4 mt-6">
        <div className="flex items-center gap-6 mb-3">
          <img
            src={leftArrowIcon}
            alt=""
            onClick={handleBackButtonClick}
            className="cursor-pointer"
          />
          <h2 className="font-semibold text-[18px]">In-Room Dining</h2>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto mb-16">
        <div className="p-2 m-2 mt-3 flex flex-col gap-4">
          {menuItemData?.map((items, itemIdx) => (
            <div
              className="flex justify-between items-start h-28"
              key={itemIdx}
            >
              <InRoomDinningItems
                items={items}
                handleItemsAdded={handleItemsAdded}
                handleItemsRemove={handleItemsRemove}
              />
            </div>
          ))}
        </div>
      </div>
      <Link to="confirmorder">
        <div className="fixed bottom-2 left-4 mr-4 z-10 bg-[#3D6464] text-white px-4 py-2 w-96 text-center border rounded-lg">
          <div className="text-[16px] font-medium tracking-wider">
            Place Order
          </div>
        </div>
      </Link>
    </div>
  );
};

export default InRoomDinningPage;
