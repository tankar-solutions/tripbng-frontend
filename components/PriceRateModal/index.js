import React from "react";
import Image from "next/image";

const PriceRateModal = ({
  isOpen,
  onClose,
  selectedRoom,
  hotelDetailsInfo,
}) => {
  if (!isOpen || !selectedRoom || !hotelDetailsInfo) return null;

  // Extract address details
  const { address } = hotelDetailsInfo.contact || {};
  const formattedAddress = address
    ? `${address.line1}, ${address.city?.name}, ${address.state?.name}, ${address.country?.name}, ${address.postalCode}`
    : "Address not available";

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-6 relative "
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-4 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          ✕
        </button>
        <p className="my-5 text-center font-medium">
          Please wait while we are checking the price and availability for your
          selection
        </p>
        <div className="flex flex-row space-x-6">
          {/* Left Side - Hotel Image */}
          {hotelDetailsInfo?.images?.[0]?.links?.find(
            (link) => link.size === "Standard"
          )?.url && (
            <div className="w-1/3">
              <Image
                src={
                  hotelDetailsInfo.images[0].links.find(
                    (link) => link.size === "Standard"
                  ).url
                }
                className="h-60 w-56 rounded-lg object-cover"
                width={150}
                height={300}
                alt="Hotel Image"
                unoptimized={true}
              />
            </div>
          )}

          {/* Right Side - Hotel Details */}
          <div className="w-full flex flex-col justify-between">
            {/* Room Details */}
            <div className="">
              <h3 className="text-lg font-semibold text-gray-700">
                {hotelDetailsInfo.name}
              </h3>
              <p className="text-gray-600 text-sm">{formattedAddress}</p>
              <div className="border-b mt-2 "></div>

              <div className="flex items-center justify-between">
                <p className="text-gray-700 mt-1">
                  {selectedRoom.rates[0].includes[0]}
                </p>
                <div className="flex flex-col items-end">
                  <p className="text-xl font-bold text-green-600 mt-1">
                    ₹{selectedRoom.rates[0].totalRate}
                  </p>
                  <p className="text-gray-500 text-sm">Per Night </p>
                </div>
              </div>
              <div className="border-b mt-2 "></div>
            </div>

            {/* Modal Buttons */}
            <div className="mt-4 flex justify-between">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition-all duration-300"
                onClick={onClose}
              >
                Cancel
              </button>
              <button className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg transition-all duration-300">
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceRateModal;
