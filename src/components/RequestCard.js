import { useState } from "react";

const RequestCard = (props) => {
  const [expanded, setExpanded] = useState(false);

  const handleReadMore = () => {
    setExpanded(!expanded);
  };
  return (
    <div className="my-4">
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-[16px] font-medium">
            {props?.orderData?.orderName} (₹ {Math.round(props?.orderData?.totalPrice*100)/100})
          </div>
          <div className="flex text-[12px] items-end">
            <span
              className={`w-56 ${
                expanded ? "" : "line-clamp-2 overflow-hidden"
              }`}
            >
              {props?.orderData?.items?.map((itemData, itemDataIndex) => {
                return (
                  <div key={itemDataIndex}>
                    ({itemData?.itemName}) x {itemData?.quantity},{" "}
                  </div>
                );
              })}
            </span>
            <span onClick={handleReadMore} className="block underline">
              {expanded ? "-less" : "+more"}
            </span>
          </div>
        </div>
        <div className="text-[14px] flex text-center">
          {props?.orderData?.orderStatus}
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
