import roomImg from "../../assests/roomImg.png";
import rightArrowImg from "../../assests/rightArrow.svg";
import { FaStar } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import imageUploadIcon from "../../assests/ImageUploadIcon.svg";
import addSignIcon from "../../assests/addSignIcon.svg";
import cancelIcon from "../../assests/cancelIcon.png"; // Import cancel icon

const StayCompletePage = () => {
  const [uploadedImages, setUploadedImages] = useState([
    false,
    false,
    false,
    false,
  ]);
  const [rating, setRating] = useState(null);
  const imageRefs = useRef([]);

  const previewFile = (event, index) => {
    const file = event.target.files[0];

    if (file instanceof Blob) {
      const reader = new FileReader();

      reader.onload = function () {
        const preview = imageRefs.current[index];
        preview.src = reader.result;

        setUploadedImages((prevUploadedImages) => {
          const newUploadedImages = [...prevUploadedImages];
          newUploadedImages[index] = true;
          return newUploadedImages;
        });
      };

      reader.readAsDataURL(file);
    } else {
      console.error("Invalid file object");
    }
  };

  const removeImage = (index) => {
    setUploadedImages((prevUploadedImages) => {
      const newUploadedImages = [...prevUploadedImages];
      newUploadedImages[index] = false;
      return newUploadedImages;
    });
    const preview = imageRefs.current[index];
    if (preview) {
      preview.src = imageUploadIcon;
    }
  };

  const handleSubmitFeedback = () => {
    // Manipulate browser history to prevent back navigation
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };

    // Close the browser or tab
    window.close();
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center font-poppins scroll-auto">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-2 p-4">
        <div className="min-h-full font-poppins tracking-wide flex gap-5 p-4 justify-center mb-4">
          <h2 className="font-semibold text-[20px]">Trip Completed</h2>
        </div>
        <div className="grid grid-cols-2 border rounded-xl h-24 justify-between border-gray-300 mb-2">
          <div className="col-span-1 flex flex-col justify-center pl-4">
            <div className="font-semibold text-[16px] ml-2">VIP Suite</div>
            <div className="font-light text-[12px] ml-2">HOTEL ABC</div>
            <div className="font-light text-[12px] ml-2">Main market Goa</div>
          </div>
          <img src={roomImg} alt="" className="h-24 w-full rounded-xl" />
        </div>
        <p className="text-[12px] text-gray-600 my-2">
          You have completed your trip. We hope you had a pleasant stay.
        </p>
        <div className="text-[12px] font-semibold">Booking ID - ABCD123456</div>
        <div className="border-[1px] rounded-xl text-center text-[13px] shadow-md font-medium p-2 flex justify-between items-center my-4 cursor-pointer">
          <div>Extend my Stay</div>
          <img src={rightArrowImg} alt="" />
        </div>
        <div className="my-4 text-[15px] font-semibold">
          Rate your Experience
        </div>
        <div className="flex justify-center gap-3 my-4">
          {[...Array(5)].map((star, index) => {
            const currentRating = index + 1;
            return (
              <label key={index}>
                <input
                  type="radio"
                  name="rating"
                  value={currentRating}
                  onClick={() => setRating(currentRating)}
                  className="hidden"
                />
                <FaStar
                  className="cursor-pointer"
                  size={30}
                  color={currentRating <= rating ? "#ffc107" : "#e4e5e9"}
                />
              </label>
            );
          })}
        </div>
        <p className="text-[12px] text-gray-600">
          Rate on a scale of 1 - 5 stars. 1 being the worst and 5 being the best
          experience with the hotel.
        </p>
        {/* <div className="mt-4 mb-2 text-[15px] font-semibold">Add Photos</div>
        <p className="text-[12px] text-gray-600">
          You can add photos related to the hotel and its surroundings.
        </p> */}
        {/* <div className="grid grid-cols-4 gap-2 my-4">
          {[...Array(4)].map((_, index) => (
            <div
              className="flex items-center justify-center w-full relative"
              key={index}
            >
              <label
                htmlFor={`dropzone-file-${index}`}
                className="relative flex items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-200 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div
                  className={`flex flex-col items-center justify-center ${
                    !uploadedImages[index] && "pt-5 pb-6"
                  }`}
                >
                  <img
                    ref={(ref) => (imageRefs.current[index] = ref)}
                    src={imageUploadIcon}
                    alt="Upload Icon"
                    className="max-w-full max-h-full"
                  />
                </div>
                <input
                  id={`dropzone-file-${index}`}
                  type="file"
                  className="hidden"
                  onChange={(event) => previewFile(event, index)}
                />
                <img
                  src={addSignIcon}
                  alt="Add Sign Icon"
                  className="absolute top-0 right-0"
                />
              </label>
              {uploadedImages[index] && (
                <button
                  className="absolute top-0 right-0 p-1 bg-white rounded-full"
                  onClick={() => removeImage(index)}
                >
                  <img src={cancelIcon} alt="Cancel Icon" className="h-2 w-2"/>
                </button>
              )}
            </div>
          ))}
        </div> */}
        <div className="text-[15px] font-semibold my-4">
          Tell us about your experience!
        </div>
        <p className="text-[14px] my-2">
          Tell us about your overall stay experience at the hotel including the
          amenities, the services, and the food etc
        </p>
        <textarea
          placeholder="Please provide some feedback here..."
          className="p-4 h-32 w-full bg-gray-100 text-black placeholder:text-gray-400 outline-none my-2"
        />
        <div
          onClick={handleSubmitFeedback}
          className="border-[1px] outline-none rounded-xl text-center text-[16px] font-medium p-2 flex justify-center items-center bg-[#3D6464] py-3 cursor-pointer"
        >
          <div className="text-white">Submit Feedback</div>
        </div>
      </div>
    </div>
  );
};

export default StayCompletePage;
