"use client";
import { Container } from "@/components/ui";
import { indianStates } from "@/constants/data/indianStates";
import { ChevronDown, ChevronUp, User, User2 } from "lucide-react";
import React, { useState } from "react";
import Select from "react-select";

const Page = () => {
  const [selectedGender, setSelectedGender] = useState(null);
  const [showGST, setShowGST] = useState(false);
  const [selectedState, setSelectedState] = useState(null);

  const handleChange = (selectedOption) => {
    setSelectedState(selectedOption);
  };
  return (
    <div className="mt-3">
      <span className="bg-black flex items-center justify-between text-white py-3 px-64">
        <h1 className="text-xl font-semibold">Complete your booking</h1>
        <p className="font-semibold">Ahmedabad to Mumbai</p>
      </span>
      <div className="flex items-start gap-3 mt-10 px-64">
        <div className="w-4/5">
          <div className="border p-5 rounded-lg mb-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Ganga Travels Go!Red BENZ
                </h2>
                <p className="text-gray">Bharat Benz A/C Sleeper (2+1)</p>
              </div>
              <div className="text-right">
                <h3 className="text-lg font-semibold">Seat No: U</h3>
                <button className="text-blue font-semibold underline">
                  View Policies
                </button>
              </div>
            </div>

            <div className="mt-10 flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-5">
                  <p className="text-xl font-semibold">14:45</p>
                  <span className="text-gray">14 Feb' 25, Fri</span>
                </div>
                <p>Ahmedabad</p>
              </div>

              <div className="border-b">
                <p>12h 50m</p>
              </div>

              <div>
                <div className="flex items-baseline gap-5">
                  <p className="text-xl font-semibold">14:45</p>
                  <span className="text-gray">14 Feb' 25, Fri</span>
                </div>
                <p>Ahmedabad</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-5">
              <p className="w-1/4 text-sm">
                Vishala (pickup by mini bus), Vishala Jaymataji private bus
                parking, near Vishala Hotel.
              </p>
              <p className="w-1/4 text-sm">
                Vishala (pickup by mini bus), Vishala Jaymataji private bus
                parking, near Vishala Hotel.
              </p>
            </div>
          </div>

          <div className="border p-5 rounded-lg mb-5">
            <h2 className="text-lg font-semibold mb-5">Traveller Details</h2>
            <div className="grid grid-cols-4 gap-4 items-center">
              <div className="flex items-center gap-3">
                <label className="block text-gray">Seat</label>
                <p className="font-semibold">U</p>
              </div>

              <div>
                <label className="block text-gray font-semibold">Name</label>
                <input
                  type="text"
                  placeholder="Type here"
                  className="w-full bg-transparent border rounded-lg py-1 px-2"
                />
              </div>

              <div>
                <label className="block text-gray font-semibold">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="eg: 24"
                  className="w-full bg-transparent border rounded-lg py-1 px-2"
                />
              </div>

              <div>
                <label className="block text-gray font-semibold">Gender</label>
                <div className="flex gap-4">
                  {[
                    { label: "Male", icon: <User size={20} /> },
                    { label: "Female", icon: <User2 size={20} /> },
                  ].map(({ label, icon }) => (
                    <button
                      type="button"
                      key={label}
                      className={`w-36 py-1 px-2 flex items-center justify-center gap-2 border rounded-lg font-medium transition-all
              ${
                selectedGender === label
                  ? "bg-yellow/50 text-yellow font-semibold border-yellow"
                  : "bg-white text-black border hover:bg-yellow/50 hover:border-yellow hover:text-yellow"
              }`}
                      onClick={() => setSelectedGender(label)}
                    >
                      {icon} {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border p-5 rounded-lg mb-5">
            <span className="flex items-baseline gap-3">
              <h2 className="text-lg font-semibold mb-5">Contact Details </h2>
              <p className="text-gray text-sm">We’ll send your ticket here</p>
            </span>
            <div className="flex items-center gap-3 w-full">
              <div className="w-1/3">
                <label className="block text-gray font-semibold">
                  Email Id
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Type here"
                  className="w-full bg-transparent border rounded-lg py-1 px-3"
                />
              </div>

              <div className="w-1/3">
                <label className="block text-gray font-semibold">
                  Mobile Number
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Type here"
                  className="w-full bg-transparent border rounded-lg py-1 px-3 "
                />
              </div>
            </div>
            <div className="border-b my-5"></div>
            <div>
              <div
                className="flex items-center cursor-pointer w-fit mb-3"
                onClick={() => setShowGST(!showGST)}
              >
                <p className="text-lg font-semibold">
                  Enter GST details (optional)
                </p>
                {showGST ? (
                  <ChevronUp className="ml-2 text-yellow font-bold" />
                ) : (
                  <ChevronDown className="ml-2 text-yellow font-bold" />
                )}
              </div>
              {showGST ? (
                <div className="flex items-center gap-3 w-full">
                  <div className="w-1/3">
                    <label className="block text-gray font-semibold">
                      Email Id
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Type here"
                      className="w-full bg-transparent border rounded-lg py-1 px-3"
                    />
                  </div>

                  <div className="w-1/3">
                    <label className="block text-gray font-semibold">
                      Mobile Number
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Type here"
                      className="w-full bg-transparent border rounded-lg py-1 px-3 "
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="border p-5 rounded-lg mb-5">
            <span className="flex items-baseline gap-3">
              <h2 className="text-lg font-semibold mb-5">
                Your pincode and state
              </h2>
              <p className="text-gray text-sm">
                (Required for GST purpose on your tax invoice. You can edit this
                anytime later in your profile section.)
              </p>
            </span>
            <div>
              <label className="text-gray font-medium ">Select the State</label>
              <Select
                options={indianStates}
                value={selectedState}
                onChange={handleChange}
                placeholder="Select a state"
                className="border text-black w-64 rounded-lg overflow-hidden"
                isSearchable
              />
              <div className="flex items-center gap-2 mt-5">
                <input
                  type="checkbox"
                  id="saveBilling"
                  className="w-4 h-4 accent-blue-500 cursor-pointer"
                />
                <label
                  htmlFor="saveBilling"
                  className="text-gray-700 cursor-pointer"
                >
                  Confirm and save billing details to your profile
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className=" w-1/4">
          <div className="border p-2 rounded-lg">
            <h2 className="text-lg font-semibold">Price details</h2>
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray">Base Fare</p>
              <p className="text font-semibold">₹1799.0</p>
            </div>
            <div className="border-b my-2"></div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray">Base Fare</p>
              <p className="text font-semibold">₹1799.0</p>
            </div>
            <p className="text-gray text-xs text-justify">Final payable amount will be updated on the next page</p>
            <button className="  text-lg font-semibold bg-yellow text-white w-full mt-3 mb-2 p-2 rounded-lg">
              Continue
            </button>
            <p className="text-xs text-gray text-justify">By proceeding, I agree to MakeMyTrip’s <span className="text-yellow">User Agreement</span>, <span className="text-yellow">Terms of Service</span> and <span className="text-yellow">Privacy Policy</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
