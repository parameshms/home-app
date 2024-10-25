import leftArrowIcon from "../assests/leftArrow.svg";
import MenuItemsPage from "./MenuItemsPage";
import { menuItemData } from "../constants/menuItemData";
const MenuPage = () => {
  const handleBackButtonClick = () => {
    window.history.back();
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
          <h2 className="font-semibold text-[18px]">Food Menu</h2>
        </div>
        <div className="text-lg font-semibold tracking-wider">
          Morning Offer
        </div>
      </div>
      <div className="flex-grow overflow-y-auto">
        <div className="p-2 m-2 mt-3 flex flex-col gap-4">
          {menuItemData.map((items, itemIdx) => (
            <div
              className="flex justify-between items-start gap-2 h-32"
              key={itemIdx}
            >
              <MenuItemsPage items={items} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default MenuPage;
