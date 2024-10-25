import Calendar from "react-awesome-calendar";

const CalendarModal = () => {
  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "" : "hidden"}`}>
      <div className="flex items-center justify-center min-h-screen bg-gray-800 bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-8 mx-10">
          <span
            className="absolute top-0 right-0 p-3 cursor-pointer"
            onClick={closeModal}
          >
            &times;
          </span>
          <Calendar />
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;
