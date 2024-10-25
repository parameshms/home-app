import { Link } from "react-router-dom";
import tickIcon from "../assests/tickIcon.svg";

const FeedbackSuccessPage = () => {
  const password = localStorage.getItem("password");
  const handleGoingBack = () =>{
    window.history.back();
  }
  return (
    <div className="bg-white rounded-lg p-8 max-w-lg mx-4 flex flex-col h-screen items-center justify-center">
      <div className="flex flex-col items-center py-14 bg-[#F3F3F3] border rounded-xl">
        <div className=" w-16 h-16 flex items-center justify-center border p-2 rounded-full bg-[#F8B64C] absolute top-60">
          <img src={tickIcon} alt="" />
        </div>
        <div className="px-2 w-full flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-semibold mb-4 text-[20px]">
            Feedback Completed
          </h1>
          <p className="text-lg text-gray-800">
            Thank you for your valuable feedback.
          </p>
        </div>
      </div>
      {/* <Link to={`/stayComplete`}> */}
        <div className="bottom-2 bg-[#3D6464] text-white font-base w-80 py-2 text-center border rounded-lg shadow-xl mt-6" onClick={()=> handleGoingBack()}>
          <div className="text-[16px] tracking-wider">Thank!</div>
        </div>
      {/* </Link> */}
    </div>
  );
};

export default FeedbackSuccessPage;
