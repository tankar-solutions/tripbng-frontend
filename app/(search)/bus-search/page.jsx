"use client";

import { Container } from "@/components/ui";
import { buses } from "@/constants/data/buses";
import { cities } from "@/constants/data/cities";
import { pickUpTime } from "@/constants/data/pickUpTime";
import { travelOperators } from "@/constants/data/travelOperators";
import Image from "next/image";
import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function BusDetails() {
  const [expandedSection, setExpandedSection] = useState({
    pickUpPoint: true,
    pickUpTime: true,
    travelOperators: true,
  });
  const [acType, setACType] = useState([]);
  const [seatType, setSeatType] = useState([]);
  const [pickTime, setPickTime] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [showAllCities, setShowAllCities] = useState(false);
  const [showAllTravelOperators, setShowAllTravelOperators] = useState(false);
  const [visibleSection, setVisibleSection] = useState({});

  const toggleSection = (section) => {
    setExpandedSection((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCityChange = (city) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  const handleACType = (value) => {
    setACType((prevState) => {
      if (prevState.includes(value)) {
        return prevState.filter((item) => item !== value);
      } else {
        return [...prevState, value];
      }
    });
  };

  const handleSeatType = (value) => {
    setSeatType((prevState) => {
      if (prevState.includes(value)) {
        return prevState.filter((item) => item !== value);
      } else {
        return [...prevState, value];
      }
    });
  };

  const handleTime = (value) => {
    setPickTime((prevState) => {
      if (prevState.includes(value)) {
        return prevState.filter((item) => item !== value);
      } else {
        return [...prevState, value];
      }
    });
  };

  const displayedCities = showAllCities ? cities : cities.slice(0, 5);
  const displayedTravelOperators = showAllTravelOperators
    ? travelOperators
    : travelOperators.slice(0, 5);

  return (
    <div className="px-32">
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
          <button class="border-2 border-yellow bg-yellow text-white px-6 py-2 focus:outline-none rounded-lg w-full lg:w-auto">
            Search
          </button>
        </div>
      </div>
      <div className="flex items-start justify-start mt-10 gap-4">
        <div className="w-[20%] bg-white shadow-lg rounded-md ">
          <div className="flex items-center justify-between border-b p-3">
            <p className="text-xl font-semibold">Filters</p>
            <button className="text-gray-500 font-medium">CLEAR ALL</button>
          </div>
          <div className="p-3">
            <p className="text-lg font-medium">AC</p>
            <div className="flex items-center gap-3 ">
              <button
                className={`flex items-center justify-center gap-3 font-medium rounded-lg w-[50%] p-1  ${
                  acType.includes("ac")
                    ? "border border-yellow text-yellow bg-yellow/20"
                    : "border border-gray text-gray"
                } hover:border-yellow hover:text-yellow hover:bg-yellow/20`}
                onClick={() => {
                  handleACType("ac");
                }}
              >
                <Image
                  src={
                    acType.includes("ac") ? "/bus/acActive.png" : "/bus/ac.png"
                  }
                  width={25}
                  height={25}
                />
                <p>AC</p>
              </button>
              <button
                className={`flex items-center justify-center gap-3 font-medium rounded-lg w-[50%] p-1 ${
                  acType.includes("non ac")
                    ? "border border-yellow text-yellow bg-yellow/20"
                    : "border border-gray text-gray"
                } hover:border-yellow hover:text-yellow hover:bg-yellow/20`}
                onClick={() => {
                  handleACType("non ac");
                }}
              >
                <Image
                  src={
                    acType.includes("non ac")
                      ? "/bus/acActive.png"
                      : "/bus/ac.png"
                  }
                  width={25}
                  height={25}
                />
                <p>Non AC</p>
              </button>
            </div>
          </div>
          <div className="border-b my-3"></div>
          <div className="p-3">
            <p className="text-lg font-medium">Seat type</p>
            <div className="flex items-center gap-3 ">
              <button
                className={`flex items-center justify-center gap-3 font-medium rounded-lg w-[50%] p-1  ${
                  seatType.includes("sleeper")
                    ? "border border-yellow text-yellow bg-yellow/20"
                    : "border border-gray text-gray"
                } hover:border-yellow hover:text-yellow hover:bg-yellow/20`}
                onClick={() => {
                  handleSeatType("sleeper");
                }}
              >
                <Image
                  src={
                    seatType.includes("sleeper")
                      ? "/bus/acActive.png"
                      : "/bus/ac.png"
                  }
                  width={25}
                  height={25}
                />
                <p>Sleeper</p>
              </button>
              <button
                className={`flex items-center justify-center gap-3 font-medium rounded-lg w-[50%] p-1 ${
                  seatType.includes("seater")
                    ? "border border-yellow text-yellow bg-yellow/20"
                    : "border border-gray text-gray"
                } hover:border-yellow hover:text-yellow hover:bg-yellow/20`}
                onClick={() => {
                  handleSeatType("seater");
                }}
              >
                <Image
                  src={
                    seatType.includes("seater")
                      ? "/bus/acActive.png"
                      : "/bus/ac.png"
                  }
                  width={25}
                  height={25}
                />
                <p>Seater</p>
              </button>
            </div>
          </div>
          <div className="border-b my-3"></div>

          {/* Pick up time - Delhi Section */}
          <div className="p-3">
            <div className="flex items-center justify-between">
              <p className="text-lg font-medium">Pick up time - Delhi</p>
              <span className="flex items-center gap-2">
                <button className="text-gray-500 text-sm font-medium">
                  CLEAR ALL
                </button>
                <FaChevronDown
                  className={`text-gray-500 cursor-pointer ${
                    expandedSection.pickUpPoint ? "-rotate-180" : "rotate-0"
                  } transition-transform`}
                  onClick={() => toggleSection("pickUpPoint")}
                />
              </span>
            </div>
            {expandedSection.pickUpPoint && (
              <div className="mt-2">
                <ul className="space-y-2">
                  {displayedCities.map((city) => (
                    <li
                      key={city.name}
                      className="flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={city.name}
                          value={city.name}
                          checked={selectedCities.includes(city.name)}
                          onChange={() => handleCityChange(city.name)}
                          className={`cursor-pointer w-4 h-4 rounded ${
                            selectedCities.includes(city.name)
                              ? "bg-yellow"
                              : "bg-gray"
                          }`}
                        />
                        <label htmlFor={city.name} className="cursor-pointer">
                          <p>{city.name}</p>
                        </label>
                      </span>
                      <p className="text-gray">({city.count})</p>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setShowAllCities((prev) => !prev)}
                  className="text-yellow mt-2"
                >
                  {showAllCities ? "Show Less" : "Show More"}
                </button>
              </div>
            )}
          </div>
          <div className="border-b my-3"></div>

          {/* Pick up point - Delhi Section */}
          <div className="p-3">
            <div className="flex items-center justify-between">
              <p className="text-lg font-medium">Pick up point - Delhi</p>
              <span className="flex items-center gap-2">
                <button className="text-gray-500 text-sm font-medium">
                  CLEAR ALL
                </button>
                <FaChevronDown
                  className={`text-gray-500 cursor-pointer ${
                    expandedSection.pickUpTime ? "-rotate-180" : "rotate-0"
                  } transition-transform`}
                  onClick={() => toggleSection("pickUpTime")}
                />
              </span>
            </div>
            {expandedSection.pickUpTime && (
              <div className="mt-2">
                <div className="grid grid-cols-2 gap-4">
                  {pickUpTime.map((item, index) => (
                    <button
                      key={index}
                      className={`flex flex-col items-center p-3 border border-gray ${
                        pickTime.includes(item.time)
                          ? "border border-yellow rounded-lg bg-yellow/20 text-yellow font-medium"
                          : "border border-gray rounded-lg text-gray font-medium"
                      } hover:bg-yellow/20 hover:text-yellow hover:border-yellow`}
                      onClick={() => handleTime(item.time)}
                    >
                      <Image
                        src={
                          pickTime.includes(item.time)
                            ? "/bus/acActive.png"
                            : "/bus/ac.png"
                        }
                        width={20}
                        height={20}
                      />
                      <p>{item.time}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="border-b my-3"></div>

          {/* Pick up time - Delhi Section */}
          <div className="p-3">
            <div className="flex items-center justify-between">
              <p className="text-lg font-medium">Travel Operators</p>
              <span className="flex items-center gap-2">
                <button className="text-gray-500 text-sm font-medium">
                  CLEAR ALL
                </button>
                <FaChevronDown
                  className={`text-gray-500 cursor-pointer ${
                    expandedSection.travelOperators ? "-rotate-180" : "rotate-0"
                  } transition-transform`}
                  onClick={() => toggleSection("travelOperators")}
                />
              </span>
            </div>
            {expandedSection.travelOperators && (
              <div className="mt-2">
                <ul className="space-y-2">
                  {displayedTravelOperators.map((city) => (
                    <li
                      key={city.name}
                      className="flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={city.name}
                          value={city.name}
                          checked={selectedCities.includes(city.name)}
                          onChange={() => handleCityChange(city.name)}
                          className={`cursor-pointer w-4 h-4 rounded ${
                            selectedCities.includes(city.name)
                              ? "bg-yellow"
                              : "bg-gray"
                          }`}
                        />
                        <label htmlFor={city.name} className="cursor-pointer">
                          <p>{city.name}</p>
                        </label>
                      </span>
                      <p className="text-gray">({city.count})</p>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setShowAllTravelOperators((prev) => !prev)}
                  className="text-yellow mt-2"
                >
                  {showAllTravelOperators ? "Show Less" : "Show More"}
                </button>
              </div>
            )}
          </div>
          <div className="border-b my-3"></div>
        </div>
        <div className="w-[80%] ">
          {buses.map((bus) => (
            <div
              key={bus.id}
              className="border border-gray-200 rounded-lg p-6 mb-6 shadow-lg bg-white hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col lg:flex-row items-center justify-between">
                {/* Bus Info */}
                <div className="lg:w-1/4 mb-4 lg:mb-0">
                  <h4 className="font-semibold text-lg lg:text-xl text-gray-800">
                    {bus.name}
                  </h4>
                  <p className="text-sm text-gray-500">{bus.type}</p>
                  <p className="text-sm text-gray-500">
                    {bus.seatsAvailable} Seats Available
                  </p>
                </div>

                {/* Travel Details */}
                <div className="lg:w-1/2 flex items-center justify-around">
                  {/* From Details */}
                  <div className="text-center">
                    <p className="text-sm text-gray-500">{bus.from}</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {bus.departure}
                    </p>
                    <p className="text-sm text-gray-500">{bus.depdate}</p>
                  </div>

                  {/* Distance Indicator */}
                  <div className="relative mx-4 flex-grow">
                    <div className="border-dashed border-gray-300 border-t h-0"></div>
                    <p className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm text-gray-600">
                      {bus.distance}
                    </p>
                  </div>

                  {/* To Details */}
                  <div className="text-center">
                    <p className="text-sm text-gray-500">{bus.to}</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {bus.arrival}
                    </p>
                    <p className="text-sm text-gray-500">{bus.arrdate}</p>
                  </div>
                </div>

                {/* Price and Button */}
                <div className="lg:w-1/4 text-right">
                  <p className="text-2xl font-bold text-gray-800">
                    {bus.price}
                  </p>
                  <button className="bg-yellow-500 text-white px-6 py-2 rounded-md mt-2 hover:bg-yellow-600">
                    SELECT SEAT
                  </button>
                </div>
              </div>

              {/* Links for Cancellation and Boarding */}
              <div className="mt-6 flex justify-end space-x-4 text-sm text-yellow-600">
                <button
                  className="hover:underline"
                  onClick={() => toggleSection(bus.id, "cancellation")}
                >
                  Cancellation Policies
                </button>
                <span>|</span>
                <button
                  className="hover:underline"
                  onClick={() => toggleSection(bus.id, "boardingDropping")}
                >
                  Boarding & Dropping Points
                </button>
              </div>

              {/* Cancellation Policy */}
              {visibleSection[bus.id] === "cancellation" && (
                <div className="mt-4 text-gray-700">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr>
                        <th className="border px-4 py-2 text-left bg-gray-100">
                          Cancellation Time
                        </th>
                        <th className="border px-4 py-2 text-center bg-gray-100">
                          Cancellation Charges
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {bus.cancellation.map((policy, index) => (
                        <tr key={index}>
                          <td className="border px-4 py-2">{policy.time}</td>
                          <td className="border px-4 py-2 text-center">
                            {policy.charges}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Boarding and Dropping Points */}
              {visibleSection[bus.id] === "boardingDropping" && (
                <div className="mt-4 text-gray-700 flex flex-wrap">
                  <div className="w-full lg:w-1/2 p-4 border border-gray-200 rounded-md mb-4 lg:mb-0">
                    <h4 className="font-semibold mb-2">Boarding Points</h4>
                    <ul className="list-disc pl-4">
                      {bus.boardingPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="w-full lg:w-1/2 p-4 border border-gray-200 rounded-md">
                    <h4 className="font-semibold mb-2">Dropping Points</h4>
                    <ul className="list-disc pl-4">
                      {bus.droppingPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
