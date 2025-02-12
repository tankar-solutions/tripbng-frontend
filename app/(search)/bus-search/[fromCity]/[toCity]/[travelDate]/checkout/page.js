import React from "react";

const Page = () => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header Section */}
      <div className="border p-4 rounded-md shadow-sm">
        <h1 className="font-bold text-lg">Laxmi Holidays</h1>
        <p className="text-sm text-gray-600">Bharat Benz A/C Seater /Sleeper (2+1)</p>

        <div className="flex justify-between mt-2">
          <div>
            <p className="text-xl font-semibold">23:20 <span className="text-gray-500">13 Feb' 25, Thu</span></p>
            <p className="text-gray-700">Delhi</p>
            <p className="text-sm text-gray-500">Isbt kashmiri gate inside...</p>
          </div>
          <div className="text-center text-gray-500">8h 10m</div>
          <div className="text-right">
            <p className="text-xl font-semibold">07:30 <span className="text-gray-500">14 Feb' 25, Fri</span></p>
            <p className="text-gray-700">Kanpur (Uttar Pradesh)</p>
            <p className="text-sm text-gray-500">Kanpur fazalganj chouraha...</p>
          </div>
        </div>
      </div>

      {/* Traveller Details */}
      <div className="border p-4 rounded-md shadow-sm mt-4">
        <h2 className="font-semibold">Traveller Details</h2>
        <div className="mt-2">
          <p className="font-medium">Seat: <span className="font-bold">SU4</span></p>
          <input type="text" placeholder="Name" className="w-full p-2 border rounded mt-2" />
          <input type="text" placeholder="Age" className="w-full p-2 border rounded mt-2" />
          <div className="flex space-x-4 mt-2">
            <button className="p-2 border rounded w-full">Male</button>
            <button className="p-2 border rounded w-full">Female</button>
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div className="border p-4 rounded-md shadow-sm mt-4">
        <h2 className="font-semibold">Contact Details</h2>
        <input type="email" placeholder="Email Id" className="w-full p-2 border rounded mt-2" />
        <input type="tel" placeholder="Mobile Number" className="w-full p-2 border rounded mt-2" />
      </div>

      {/* State Selection */}
      <div className="border p-4 rounded-md shadow-sm mt-4">
        <h2 className="font-semibold">Your Pincode and State</h2>
        <select className="w-full p-2 border rounded mt-2">
          <option>Gujarat</option>
        </select>
        <label className="flex items-center mt-2">
          <input type="checkbox" className="mr-2" /> Confirm and save billing details
        </label>
      </div>

      {/* Price Details & Offers */}
      <div className="border p-4 rounded-md shadow-sm mt-4">
        <h2 className="font-semibold">Offers</h2>
        <div className="flex items-center space-x-2 mt-2">
          <input type="radio" name="offer" /> <label>BESTBUS - Get Rs 100 OFF</label>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <input type="radio" name="offer" /> <label>BUSTRAINPASS - Rs 99 for vouchers</label>
        </div>
        <input type="text" placeholder="Enter coupon code" className="w-full p-2 border rounded mt-2" />
        <button className="w-full bg-blue-500 text-white p-2 rounded mt-2">Apply</button>
      </div>

      {/* Price Summary */}
      <div className="border p-4 rounded-md shadow-sm mt-4">
        <h2 className="font-semibold">Price Details</h2>
        <p className="flex justify-between mt-2"><span>Base Fare</span> <span>₹2598</span></p>
        <p className="flex justify-between font-bold mt-2"><span>Total</span> <span>₹2598</span></p>
        <button className="w-full bg-blue-500 text-white p-2 rounded mt-4">CONTINUE</button>
      </div>
    </div>
  );
};

export default Page;
