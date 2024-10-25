import { useState } from "react";
const OrderMiniBitesItems = (props) => {
  const [addItem, setAddItem] = useState(0);

  const handleAddItem = () => {
    setAddItem(1);
    let data = {
      itemId: props.items._id,
      name: props.items.itemName,
      type: props.items.itemType,
      price: props.items.itemPrice,
      quantity: 1,
    };
    props.handleItemsAdded(data);
  };
  const handleAddMoreItem = () => {
    setAddItem((prev) => prev + 1);
    let data = {
      itemId: props.items._id,
      name: props.items.itemName,
      type: props.items.itemType,
      price: props.items.itemPrice,
      quantity: addItem + 1,
    };
    props.handleItemsAdded(data);
  };
  const handleRemoveMoreItem = () => {
    setAddItem((prev) => prev - 1);
    let data = {
      itemId: props.items._id,
      name: props.items.itemName,
      type: props.items.itemType,
      price: props.items.itemPrice,
      quantity: addItem - 1,
    };
    props.handleItemsRemove(data);
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="flex gap-2 text-[16px] font-semibold items-start w-52 text-wrap">
          {/* {props?.items?.itemType === "veg" ? (
            <img src={vegIcon} alt="" className="mt-1" />
          ) : (
            <img src={nonVegIcon} alt="" className="mt-1" />
          )} */}
          <span className="w-48 truncate">{props?.items?.itemName}</span>
        </div>
        <div className="text-[14px] font-semibold">
          ₹ {props?.items?.itemPrice}
        </div>
        <div className="text-[12px] font-light w-48 line-clamp-3">
          {props?.items?.description}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center relative">
        <img
          className="h-28 object-contain"
          src={props?.items?.itemImage}
          alt=""
        />
        {addItem === 0 ? (
          <div
            className="flex items-center justify-center p-1 w-20 border shadow-md rounded-md absolute top-20 bg-white text-[14px] font-semibold text-[#3D6464]"
            onClick={() => handleAddItem()}
          >
            ADD
          </div>
        ) : (
          <div className="flex justify-between items-center text-[14px] p-1 px-2 w-20 border shadow-md rounded-md absolute top-20 bg-white font-semibold text-[#3D6464]">
            <div onClick={handleRemoveMoreItem}>-</div>
            <div>{addItem}</div>
            <div onClick={handleAddMoreItem}>+</div>
          </div>
        )}
      </div>
    </>
  );
};

export default OrderMiniBitesItems;
