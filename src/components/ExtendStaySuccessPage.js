import tickIcon from "../assests/tickIcon.svg";

const ExtendStaySuccessPage = () => {
  const handleGoingBack = () => {
    window.history.back();
    window.history.back();
  };
  return (
    <div className="bg-white rounded-lg p-8 max-w-lg mx-4 flex flex-col h-screen items-center justify-center">
      <div className=" w-16 h-16 flex items-center justify-center border p-2 rounded-full bg-[#F8B64C] relative top-8">
        <img src={tickIcon} alt="" />
      </div>
      <div className="flex flex-col items-center py-14 bg-[#F3F3F3] border rounded-xl">
        {/* <div className=" w-16 h-16 flex items-center justify-center border p-2 rounded-full bg-[#F8B64C] absolute top-64">
          <img src={tickIcon} alt="" />
        </div> */}
        <div className="px-2 w-full flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-semibold mb-4 text-[20px]">
            Request Placed
          </h1>
          <p className="text-lg text-gray-800">
            You placed a request for Room extension. Front desk will contact you
            soon for further details.
          </p>
        </div>
      </div>
      <div
        className="bottom-2 bg-[#3D6464] text-white font-base w-80 py-2 text-center border rounded-lg shadow-xl mt-6"
        onClick={() => handleGoingBack()}
      >
        <div className="text-[16px] tracking-wider">Thank!</div>
      </div>
    </div>
  );
};

export default ExtendStaySuccessPage;
