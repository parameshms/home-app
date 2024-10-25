import vegIcon from "../assests/vegIcon.svg";
import nonVegIcon from "../assests/non-vegIcon.svg";
const MenuItemsPage = (props) => {
  return (
    <>
      <div className="flex flex-col">
        <div className="flex gap-2 text-[16px] font-semibold items-start w-52 text-wrap">
          {props.items.item_type === "veg" ? (
            <img src={vegIcon} alt="" className="mt-1" />
          ) : (
            <img src={nonVegIcon} alt="" className="mt-1" />
          )}
          <span>{props.items.item_name}</span>
        </div>
        <div className="text-[14px] font-semibold">
          ₹ {props.items.item_price}
        </div>
        <div className="text-[12px] font-light w-48 line-clamp-3">
          {props.items.item_description}
        </div>
      </div>
      <img src={props.items.item_img} alt="" />
    </>
  );
};

export default MenuItemsPage;
