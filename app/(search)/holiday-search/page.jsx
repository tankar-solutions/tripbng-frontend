'use client';

import React, { useState } from 'react';
import Slider from '@mui/material/Slider';
import Image from 'next/image';


export default function HolidayDetails() {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [sliderValue, setSliderValue] = useState([10000, 30000]); 
  
    const clearAllFilters = () => {
      document.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
        checkbox.checked = false;
      });
      setSliderValue([10000, 30000]);
      setSelectedCategory(null); 
    };
  
    const handleSliderChange = (event, newValue) => {
      setSliderValue(newValue);
    };
  
    return (
      <div className="bg-white min-h-screen">
        {/* Header Section */}
        <header className="bg-white text-black p-6 flex justify-center items-center w-full">
          <div className="grid grid-cols-6 mt-5">
            <div className="border rounded-l-xl p-4">
              <p className="text-sm">From</p>
              <p className="text-md font-semibold">New York</p>
            </div>
            <div className="border p-4">
              <p className="text-sm">To</p>
              <p className="text-md font-semibold">Los Angeles</p>
            </div>
            <div className="border p-4">
              <p className="text-sm">Departure</p>
              <p className="text-md font-semibold">Mon, 15 Jan</p>
            </div>
            <div className="border p-4">
              <p className="text-sm">Return</p>
              <p className="text-md font-semibold">-</p>
            </div>
            <div className="border p-4">
              <p className="text-sm">Travellers & Class</p>
              <p className="text-md font-semibold">2 Travellers, Economy</p>
            </div>
            <div className="border p-4 rounded-r-xl flex items-center justify-center">
              <button className="border-2 border-yellow bg-yellow text-white px-6 py-2 focus:outline-none rounded-lg w-full lg:w-auto">
                Search
              </button>
            </div>
          </div>
        </header>
  
        {/* Main Section */}
        <main className="flex flex-row gap-4 lg:px-96 h-full">
          {/* Sort By and Filter Section */}
          <aside className="w-full lg:w-1/5 border border-gray-300 rounded-md p-10 lg:mb-0 lg:mr-4 h-full relative">
            <div className="absolute top-2 left-2 flex text-xl font-semibold">Sort By</div>
            <div className="relative">
              <hr
                className="border-dashed border-gray-300 mb-4"
                style={{
                  position: "absolute",
                  left: "0",
                  right: "0",
                  marginLeft: "-40px",
                  marginRight: "-40px",
                  top: "50%",
                }}
              />
            </div>
            <div className="flex flex-col space-y-2">
              {["Popular", "Price Low to High", "Price High to Low", "Nights Low to High", "Nights High to Low"].map(
                (label, index) => (
                  <label key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2 accent-orange-500 w-4 h-4 border-2 border-gray-400"
                    />
                    {label}
                  </label>
                )
              )}
            </div>
            <br />
            <div className="relative">
              <hr
                className="border-dashed border-gray-300 mb-4"
                style={{
                  position: "absolute",
                  left: "0",
                  right: "0",
                  marginLeft: "-40px",
                  marginRight: "-40px",
                  top: "50%",
                }}
              />
            </div>
  
            <div className="absolute top-46 left-2 flex text-xl font-semibold">Filters</div>
            <br />
            <br />
  
            {/* Price Range */}
            <div className="flex flex-col space-y-2">
              {["₹25,000", "₹25,000 - ₹35,000", "₹35,000 - ₹45,000", "₹45,000"].map((price, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2 accent-orange-500 w-4 h-4 border-2 border-gray-400"
                  />
                  {price}
                </label>
              ))}
            </div>
            <div className="relative">
              <hr
                className="border-dashed border-gray-300 mb-4"
                style={{
                  position: "absolute",
                  left: "0",
                  right: "0",
                  marginLeft: "-40px",
                  marginRight: "-40px",
                  top: "50%",
                }}
              />
            </div>
            <br />
  
            {/* Night Slider */}
            <p className="text-lg font-semibold mb-2">Night</p>
            <Slider
              value={sliderValue}
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              min={8000}
              max={50000}
              step={1000}
              sx={{
                color: "#FF8E00",
                "& .MuiSlider-thumb": {
                  backgroundColor: "#ffffff",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)",
                  "&:hover": {
                    backgroundColor: "#ffffff",
                  },
                },
              }}
            />
            <div className="flex justify-between mt-2">
              <span>3N</span>
              <span>6N</span>
            </div>
            <div className="relative">
              <hr
                className="border-dashed border-gray-300 mb-4"
                style={{
                  position: "absolute",
                  left: "0",
                  right: "0",
                  marginLeft: "-40px",
                  marginRight: "-40px",
                  top: "50%",
                }}
              />
            </div>
  
            {/* Hotel Category */}
            <p className="text-lg font-semibold mt-8">Hotel Category</p>
            <div className="flex space-x-4 mt-4">
              {["3 Star", "4 Star", "5 Star", "Luxury"].map((category, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-1/4 border-2 text-center px-2 py-1 rounded-lg transition duration-300
                           ${selectedCategory === category ? "bg-yellow border-yellow" : "bg-white border-gray-400"}`}
                >
                  {category}
                </button>
              ))}
            </div>
            <br />
  
            {/* Flight Options */}
            <div className="relative">
              <hr
                className="border-dashed border-gray-300 mb-4"
                style={{
                  position: "absolute",
                  left: "0",
                  right: "0",
                  marginLeft: "-40px",
                  marginRight: "-40px",
                  top: "50%",
                }}
              />
            </div>
            <p className="text-lg font-semibold mt-8">Flight</p>
            <div className="flex space-x-4 mt-4">
              {["with Flight", "without Flight"].map((category, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-1/2 border-2 text-center px-2 py-1 rounded-lg transition duration-300
                           ${selectedCategory === category ? "bg-yellow border-yellow" : "bg-white border-gray-400"}`}
                >
                  {category}
                </button>
              ))}
            </div>
            <br />
  
            {/* Places */}
            <div className="relative">
              <hr
                className="border-dashed border-gray-300 mb-4"
                style={{
                  position: "absolute",
                  left: "0",
                  right: "0",
                  marginLeft: "-40px",
                  marginRight: "-40px",
                  top: "50%",
                }}
              />
            </div>
            <br />
            <p className="text-lg font-semibold mb-2">Places</p>
            <div className="flex flex-col space-y-2">
              {["Plot Blair", "Havelock Island", "Neil Islands"].map((places, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2 accent-orange-500 w-4 h-4 border-2 border-gray-400"
                  />
                  {places}
                </label>
              ))}
            </div>
            <br />
  
            {/* Themes */}
            <div className="relative">
              <hr
                className="border-dashed border-gray-300 mb-4"
                style={{
                  position: "absolute",
                  left: "0",
                  right: "0",
                  marginLeft: "-40px",
                  marginRight: "-40px",
                  top: "50%",
                }}
              />
            </div>
            <br />
            <p className="text-lg font-semibold mb-2">Themes</p>
            <div className="flex flex-col space-y-2">
              {["Family Tour", "Honeymoon Special", "Vacation Special", "Water Sports"].map((themes, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2 accent-orange-500 w-4 h-4 border-2 border-gray-400"
                  />
                  {themes}
                </label>
              ))}
            </div>
          </aside>
  
          {/* Main Content Section */}
    
          <div className="w-full lg:w-1/5 bg-white rounded-md p-0 lg:mb-0 lg:mr-4 h-full relative shadow-lg">
          <a href="/holiday-search/holiday-details" className="flex flex-col items-center h-full">
            <div className="flex flex-col items-center h-full">
                <Image
                src="/holiday/beach.jpg"
                className="rounded-lg object-cover w-full h-full" 
                alt="Holiday img"
                width={100}
                height={100}
                />
                <p className="text-xl font-semibold justify-start mt-4">Beaches of Andaman</p>
                <p className="text-gray-600">Included 3 star hotels</p>
                <p className="text-xs text-gray-600">2N Port Blair  |  1N Havelock Island</p><br/><br/>
            </div><br /><br />
            <div className="absolute bottom-0 w-full bg-gray-300 p-4 rounded-b-md">
                    <p className="text-left text-gray-800">starting Price</p>
                    <p className="text-left">
                    <span className="text-yellow">INR 13000</span> <span className="text-gray-800"> / per person</span>
                    </p>

                </div>
                </a>
            </div>

            <div className="w-full lg:w-1/5 bg-white rounded-md p-0 lg:mb-0 lg:mr-4 h-full relative shadow-lg">

            <div className="flex flex-col items-center h-full">
                <Image
                src="/holiday/island.jpg"
                className="rounded-lg object-cover w-full h-full"
                alt="Holiday img"
                width={100}
                height={100}
                />
                <p className="text-xl font-semibold justify-start mt-4">Island of Andaman</p>
                <p className="text-gray-600">Included 3 star hotels</p>
                <p className="text-xs text-gray-600">2N Port Blair  |  1N Havelock Island</p><br/><br/>
            </div><br /><br />
            <div className="absolute bottom-0 w-full bg-gray-300 p-4 rounded-b-md">
                    <p className="text-left text-gray-800">starting Price</p>
                    <p className="text-left">
                    <span className="text-yellow">INR 16800</span> <span className="text-gray-800"> / per person</span>
                    </p>
                </div>
          
            </div>

            <div className="w-full lg:w-1/5 bg-white rounded-md p-0 lg:mb-0 lg:mr-4 h-full relative shadow-lg">
            <a href="/holiday-search/holiday-details" className="flex flex-col items-center h-full">
            <div className="flex flex-col items-center h-full">
                <Image
                src="/holiday/best.jpg"
                className="rounded-lg object-cover w-full h-full"
                alt="Holiday img"
                width={100}
                height={100}
                />
                <p className="text-xl font-semibold justify-start mt-4">Best of Andaman</p>
                <p className="text-gray-600">Included 3 star hotels</p>
                <p className="text-xs text-gray-600">2N Port Blair  |  1N Havelock Island</p><br/><br/>
            </div><br /><br />
            <div className="absolute bottom-0 w-full bg-gray-300 p-4 rounded-b-md">
                    <p className="text-left text-gray-800">starting Price</p>
                    <p className="text-left">
                    <span className="text-yellow">INR 19500</span> <span className="text-gray-800"> / per person</span>
                    </p>
                </div>
          </a>
            </div>
        </main>
      </div>
    );
  }
  