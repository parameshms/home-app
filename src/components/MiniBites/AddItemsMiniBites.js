import { useState } from "react";
// import nonVegIcon from "../assests/non-vegIcon.svg";
// import vegIcon from "../assests/vegIcon.svg";
const AddedItemMiniBites = (props) => {
  const [itemCount, setItemCount] = useState(props.data.quantity);

  const handleAddMoreItem = () => {
    setItemCount((prev) => prev + 1);
    props.handleAddItem(props.data.name);
  };
  const handleRemoveMoreItem = () => {
    setItemCount((prev) => prev - 1);
    props.handleRemoveItem(props.data.name);
  };
  return (
    <div>
      <div className="flex justify-between gap-4 py-1">
        <div className="flex gap-3">
          {/* <img
            src={props.data.name === "non-veg" ? nonVegIcon : vegIcon}
            alt=""
          /> */}
          <div className="w-56 truncate">{props.data.name}</div>
        </div>
        <div className="flex justify-between items-center text-[14px] px-3 w-24 border shadow-md rounded-md bg-white font-semibold text-[#3D6464]">
          <div onClick={handleRemoveMoreItem}>-</div>
          <div>{itemCount}</div>
          <div onClick={handleAddMoreItem}>+</div>
        </div>
      </div>
      <div className="flex justify-between">
        <div>₹ {props.data.price}</div>
        <div>₹ {props.data.price * props.data.quantity}</div>
      </div>
    </div>
  );
};

export default AddedItemMiniBites;
