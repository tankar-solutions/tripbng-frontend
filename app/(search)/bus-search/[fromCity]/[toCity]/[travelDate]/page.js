"use client";

import Simmer from "@/components/layout/simmer";
import RoundedLoader from "@/components/RoundedLoader";
import { Container } from "@/components/ui";
import { buses } from "@/constants/data/buses";
import { cities } from "@/constants/data/cities";
import { pickUpTime } from "@/constants/data/pickUpTime";
import { travelOperators } from "@/constants/data/travelOperators";
import { apiService } from "@/lib/api";
import { Ban } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaChevronDown } from "react-icons/fa";

export default function BusDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const cleanPathname = pathname.split("?")[0];
  const pathSegments = cleanPathname.split("/").filter(Boolean);

  const fromCityName = pathSegments[1] || "Unknown";
  const toCityName = pathSegments[2] || "Unknown";
  const travelDate = pathSegments[3] || "Date not provided";

  const fromCityId = searchParams.get("from_code") || "Not found";
  const toCityId = searchParams.get("to_code") || "Not found";

  const convertDateFormat = (date) => {
    if (!date || date === "Date not provided") return null;

    const parts = date.split("-");
    if (parts.length !== 3) return null;

    const [day, month, year] = parts;
    return `${month}/${day}/${year}`;
  };

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
  const [busList, setBusList] = useState([]);
  const [seatMap, setSeatMap] = useState({});
  const [selectedSeats, setSelectedSeats] = useState({});
  const [selectedPickup, setSelectedPickup] = useState({});
  const [selectedDrop, setSelectedDrop] = useState({});
  const [searchKey, setSearchKey] = useState(null);
  const [busSeatMap, setBusSeatMap] = useState({});
  const [busPickup, setBusPickup] = useState([]);
  const [busDrop, setBusDrop] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaderBusList, setLoaderBusList] = useState(false);
  // Independent seat selection states
  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState([]);
  const [selectedSeatKeys, setSelectedSeatKeys] = useState([]);

  // Group seats by row
  const groupedSeats = Array.isArray(busSeatMap)
    ? busSeatMap.reduce((acc, seat) => {
        const row = parseInt(seat.Row, 10);
        if (!acc[row]) acc[row] = [];
        acc[row].push(seat);
        return acc;
      }, {})
    : {};

  // Sort rows numerically
  const sortedRows = Object.keys(groupedSeats)
    .map(Number)
    .sort((a, b) => a - b);

  const handleSeatSelect = (busKey, seat) => {
    setSelectedSeatNumbers((prev) => {
      const currentSelection = prev[busKey] || [];

      const updatedSelection = currentSelection.includes(seat.Seat_Number)
        ? currentSelection.filter((num) => num !== seat.Seat_Number) // Remove
        : [...currentSelection, seat.Seat_Number]; // Add

      return { ...prev, [busKey]: updatedSelection };
    });
  };

  // UI for displaying selected seats per bus
  {
    Object.entries(selectedSeatNumbers).map(([busKey, seats]) => (
      <div
        key={busKey}
        className="mt-4 p-2 bg-white border rounded text-center"
      >
        <h3 className="font-bold">Selected Seats for Bus {busKey}:</h3>
        <p>Numbers: {seats.join(", ") || "None"}</p>
      </div>
    ));
  }

  useEffect(() => {
    getBusList();
  }, []);

  const getBusList = async () => {
    setLoaderBusList(true);
    try {
      const formattedTravelDate = convertDateFormat(travelDate);

      const response = await apiService.post("/bus/searchbus", {
        From_City: fromCityId,
        To_City: toCityId,
        TravelDate: formattedTravelDate,
      });

      if (response?.data?.success) {
        setBusList(response?.data?.data?.Buses);
        setSearchKey(response?.data?.data?.Search_Key);
      } else {
        toast.error("Failed to fetch buses");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } finally {
      setLoaderBusList(false);
    }
  };

  const handleSeatMap = async (busKey) => {
    setSeatMap((prev) => {
      const newState = { [busKey]: !prev[busKey] };
      return newState;
    });

    setLoading(true);
    try {
      const response = await apiService.post("/bus/seatmap", {
        Boarding_Id: "27176",
        Dropping_Id: "24515",
        Bus_Key: busKey,
        Search_Key: searchKey,
      });

      if (response?.data?.success) {
        toast.success("Bus seat map fetched successfully!");
        // setBusSeatMap((prev) => ({
        //   ...prev,
        //   [busKey]: processSeatMap(response?.data?.data?.SeatMap),
        // }));
        setBusSeatMap(response?.data?.data?.SeatMap);
        setBusPickup(response?.data?.data?.BoardingDetails);
        setBusDrop(response?.data?.data?.DroppingDetails);
      } else {
        toast.error("Failed to fetch bus seat map");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // const processSeatMap = (seats) => {
  //   let maxRow = 0;
  //   let maxCol = 0;

  //   seats.forEach(({ Row, Column }) => {
  //     maxRow = Math.max(maxRow, parseInt(Row));
  //     maxCol = Math.max(maxCol, parseInt(Column));
  //   });

  //   const seatGrid = Array.from({ length: maxRow + 1 }, () =>
  //     Array(maxCol + 1).fill("X")
  //   );

  //   seats.forEach(({ Row, Column, Seat_Number }) => {
  //     const rowIndex = parseInt(Row);
  //     const colIndex = parseInt(Column);

  //     if (seatGrid[rowIndex][colIndex] === "X") {
  //       seatGrid[rowIndex][colIndex] = Seat_Number;
  //     } else {
  //       console.warn(
  //         `Duplicate seat detected at Row: ${rowIndex}, Col: ${colIndex}`
  //       );
  //     }
  //   });

  //   seatGrid.forEach((row) => row.reverse());

  //   return seatGrid;
  // };

  const handleSeatSelection = (busKey, seat) => {
    setSelectedSeats((prev) => {
      const selectedForBus = prev[busKey] || [];
      if (selectedForBus.includes(seat)) {
        return { ...prev, [busKey]: selectedForBus.filter((s) => s !== seat) };
      } else {
        return { ...prev, [busKey]: [...selectedForBus, seat] };
      }
    });
  };

  const handlePickupSelection = (busKey, location) => {
    setSelectedPickup((prev) => ({
      ...prev,
      [busKey]: location,
    }));
  };

  const handleDropSelection = (busKey, location) => {
    setSelectedDrop((prev) => ({
      ...prev,
      [busKey]: location,
    }));
  };

  const busSeats = [
    [1, 2, "X", 3, 4],
    [5, 6, "X", 7, 8],
    [9, 10, "X", 11, 12],
    [13, 14, "X", 15, 16],
  ];
  const staticPickupLocations = [
    "Main Bus Stand",
    "City Center",
    "Railway Station",
    "Airport",
  ];

  const staticDropLocations = [
    "Central Market",
    "University Gate",
    "IT Park",
    "Suburb Terminal",
  ];
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
  const [formattedDate, setFormattedDate] = useState(""); // Avoid mismatch

  useEffect(() => {
    if (!travelDate) return; // Ensure travelDate exists

    // Convert "11-02-2025" (DD-MM-YYYY) to "2025-02-11" (YYYY-MM-DD)
    const [day, month, year] = travelDate.split("-");
    const formattedTravelDate = `${year}-${month}-${day}`;

    const dateObject = new Date(formattedTravelDate);
    if (isNaN(dateObject.getTime())) return; // Validate date

    setFormattedDate(
      new Intl.DateTimeFormat("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      }).format(dateObject)
    );
  }, [travelDate]);

  const displayedCities = showAllCities ? cities : cities.slice(0, 5);
  const displayedTravelOperators = showAllTravelOperators
    ? travelOperators
    : travelOperators.slice(0, 5);

  return (
    <div className="px-32 py-10">
      <div className="grid grid-cols-4 mt-5">
        <div className="border rounded-l-xl p-4">
          <p className="text-sm">From</p>
          <p className="text-md font-semibold">{fromCityName}</p>
        </div>
        <div className="border p-4">
          <p className="text-sm">To</p>
          <p className="text-md font-semibold">{toCityName}</p>
        </div>
        <div className="border p-4">
          <p className="text-sm">Departure</p>
          <p className="text-md font-semibold">{formattedDate}</p>
        </div>

        <div className="border p-4 rounded-r-xl flex items-center justify-center">
          <button
            class="border-2 border-yellow bg-yellow text-white px-6 py-2 focus:outline-none rounded-lg w-full lg:w-auto"
            onClick={() => router.push("/bus")}
          >
            Modify
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
        {loaderBusList ? (
          <Simmer />
        ) : (
          <div className="w-[100%] ">
            {busList && busList.length > 0 ? (
              busList.map((bus) => {
                const busKey = bus.Bus_Key; // Define busKey inside the map function

                return (
                  <div
                    key={busKey}
                    className="border border-gray-200 rounded-lg p-6 mb-3 shadow-lg bg-white hover:shadow-xl transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row items-center justify-between">
                      {/* Bus Info */}
                      <div className="lg:w-1/4 mb-4 lg:mb-0">
                        <h4 className="font-semibold text-lg lg:text-xl text-gray-800">
                          {bus.Operator_Name}
                        </h4>
                        <p className="text-sm text-gray-500">{bus.Bus_Type}</p>
                        <p className="text-sm text-gray-500">
                          {bus.Available_Seats} Seats Available
                        </p>
                      </div>

                      {/* Travel Details */}
                      <div className="lg:w-1/2 flex items-center justify-around">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">{bus.from}</p>
                          <p className="text-lg font-semibold text-gray-800">
                            {bus.Departure_Time}
                          </p>
                          <p className="text-sm text-gray-500">{bus.depdate}</p>
                        </div>
                        <div className="relative mx-4 flex-grow">
                          <div className="border-dashed border-gray-300 border-t h-0"></div>
                          <p className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm text-gray-600">
                            {bus.Duration}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">{bus.to}</p>
                          <p className="text-lg font-semibold text-gray-800">
                            {bus.Arrival_Time}
                          </p>
                          <p className="text-sm text-gray-500">{bus.arrdate}</p>
                        </div>
                      </div>

                      {/* Price and Button */}
                      <div className="lg:w-1/4 text-right">
                        <p className="text-2xl font-bold text-gray-800">
                          {bus.FareMasters && bus.FareMasters.length > 0
                            ? `₹${Math.min(
                                ...bus.FareMasters.map(
                                  (fare) => fare.Basic_Amount
                                )
                              )}`
                            : "N/A"}
                        </p>
                        <button
                          className="bg-yellow text-white px-6 py-2 font-semibold rounded-md mt-2 hover:bg-yellow-600"
                          onClick={() => handleSeatMap(busKey)}
                        >
                          SELECT SEAT
                        </button>
                      </div>
                    </div>

                    {/* Seat Selection */}
                    {seatMap[busKey] && (
                      <div>
                        {loading ? (
                          <RoundedLoader />
                        ) : (
                          <div className="mt-6 border-t border-gray-300 pt-6 w-full">
                            <div className="flex flex-col md:flex-row items-start w-full gap-4">
                              {/* Seat Selection Section */}
                              <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col">
                                <div className="flex items-center justify-between bg-grayLight px-4 py-2 rounded-t-lg">
                                  <h2 className="text-sm font-semibold text-gray-800 text-center">
                                    Select Your Seat
                                  </h2>
                                </div>

                                <div className="bg-gray-100 p-2 rounded-lg mx-auto relative">
                                  {/* Lower Berth */}
                                  <h3 className="text-center font-bold text-lg my-2">
                                    Lower Berth
                                  </h3>
                                  <div className="flex flex-col gap-2 p-2 w-fit mx-auto">
                                    {sortedRows.map((rowIndex) => (
                                      <div
                                        key={rowIndex}
                                        className="flex gap-2 justify-center"
                                      >
                                        {groupedSeats[rowIndex]
                                          .filter((seat) => seat.ZIndex === "0") // Only Lower Berth
                                          .map((seat) => {
                                            const isSelected =
                                              selectedSeatNumbers[
                                                busKey
                                              ]?.includes(seat.Seat_Number);
                                            return (
                                              <div
                                                key={seat.Seat_Key}
                                                onClick={() =>
                                                  seat.Bookable &&
                                                  handleSeatSelect(busKey, seat)
                                                } // Prevent selection if not bookable
                                                className={`h-8 flex items-center  text-xs justify-between px-2 border rounded cursor-pointer transition-all duration-200
                                                  ${
                                                    seat.Bookable === false
                                                      ? "bg-gray/50 border-gray text-gray font-semibold cursor-not-allowed"
                                                      : ""
                                                  }     ${
                                                  isSelected
                                                    ? "bg-yellow/50 text-yellow font-semibold text-lg border-yellow"
                                                    : ""
                                                } 
    ${seat.Bookable && !isSelected ? "bg-white" : ""} 
    ${seat.Length === "2" ? "w-16" : "w-8"}
  `}
                                              >
                                                <p> {seat.Seat_Number}</p>
                                                {seat.Length === "2" ? (
                                                  <span
                                                    className={`h-5 w-2 border rounded-lg ${
                                                      isSelected
                                                        ? "border-yellow"
                                                        : ""
                                                    } ${
                                                      seat.Bookable === false
                                                        ? " border-gray "
                                                        : ""
                                                    }  `}
                                                  ></span>
                                                ) : null}
                                              </div>
                                            );
                                          })}
                                      </div>
                                    ))}
                                  </div>

                                  {/* Upper Berth */}
                                  <h3 className="text-center font-bold text-lg my-2">
                                    Upper Berth
                                  </h3>
                                  <div className="flex flex-col gap-2 p-2 w-fit mx-auto">
                                    {sortedRows.map((rowIndex) => (
                                      <div
                                        key={rowIndex}
                                        className="flex gap-2 justify-center"
                                      >
                                        {groupedSeats[rowIndex]
                                          .filter((seat) => seat.ZIndex === "1") // Only Upper Berth
                                          .map((seat) => {
                                            const isSelected =
                                              selectedSeatNumbers[
                                                busKey
                                              ]?.includes(seat.Seat_Number);
                                            return (
                                              <div
                                                key={seat.Seat_Key}
                                                onClick={() =>
                                                  seat.Bookable &&
                                                  handleSeatSelect(busKey, seat)
                                                } // Prevent selection if not bookable
                                                className={`h-8 flex items-center text-xs justify-between px-2 border rounded cursor-pointer transition-all duration-200
                  ${
                    seat.Bookable === false
                      ? "bg-gray/50 border-gray text-gray font-semibold cursor-not-allowed"
                      : ""
                  } 
    ${isSelected ? "bg-green-500 text-white" : ""} 
    ${
      isSelected
        ? "bg-yellow/50 text-yellow font-semibold text-lg border-yellow"
        : ""
    }     ${seat.Length === "2" ? "w-16" : "w-8"}
                `}
                                              >
                                                <p> {seat.Seat_Number}</p>
                                                {seat.Length === "2" ? (
                                                  <span
                                                    className={`h-5 w-2 border rounded-lg ${
                                                      isSelected
                                                        ? "border-yellow"
                                                        : ""
                                                    }  ${
                                                      seat.Bookable === false
                                                        ? " border-gray "
                                                        : ""
                                                    } `}
                                                  ></span>
                                                ) : null}
                                              </div>
                                            );
                                          })}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Pickup & Drop Selection */}
                              <div className="relative w-full md:w-1/2 bg-white rounded-lg shadow-md flex flex-col">
                                <div className="flex items-center justify-between bg-grayLight px-4 py-2 rounded-t-lg">
                                  <h2 className="text-sm font-semibold text-gray-800 text-center">
                                    Select Pickup & Drop
                                  </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 px-2 py-4 h-full flex-grow mb-32">
                                  {/* Pickup Points */}
                                  <div className="border border-gray-300 rounded-md bg-gray-50 shadow-sm flex flex-col h-[500px]">
                                    <div className="flex items-center justify-between bg-grayLight px-2 py-1 rounded-t-sm">
                                      <h2 className="text-sm font-semibold text-gray-800 text-center">
                                        Pick Up Point
                                      </h2>
                                    </div>
                                    <ul className="list-none space-y-2 overflow-auto flex-grow">
                                      {busPickup.map((point, index) => (
                                        <li
                                          key={index}
                                          className="p-2 border-b bg-white"
                                        >
                                          <label className="flex items-start gap-2 cursor-pointer">
                                            <input
                                              type="radio"
                                              name="pickup"
                                              checked={
                                                selectedPickup["pickup"]
                                                  ?.Boarding_Id ===
                                                point.Boarding_Id
                                              }
                                              onChange={() =>
                                                handlePickupSelection(
                                                  "pickup",
                                                  point
                                                )
                                              }
                                              className="accent-yellow-600 mt-1"
                                            />
                                            <div>
                                              <p className="font-semibold">
                                                {point.Boarding_Name}
                                              </p>
                                              <p className="text-sm text-gray-600">
                                                {point.Boarding_Address}
                                              </p>
                                              <p className="text-sm text-gray-600">
                                                Landmark:{" "}
                                                {point.Boarding_Landmark}
                                              </p>
                                              <p className="text-sm text-gray-600">
                                                Contact:{" "}
                                                {point.Boarding_Contact}
                                              </p>
                                              <p className="text-sm text-gray-600">
                                                Time: {point.Boarding_Time}
                                              </p>
                                            </div>
                                          </label>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  {/* Drop Points */}
                                  <div className="border border-gray-300 rounded-md bg-gray-50 shadow-sm flex flex-col h-[500px]">
                                    <div className="flex items-center justify-between bg-grayLight px-2 py-1 rounded-t-sm">
                                      <h2 className="text-sm font-semibold text-gray-800 text-center">
                                        Drop Off Point
                                      </h2>
                                    </div>
                                    <ul className="list-none space-y-2 overflow-auto flex-grow">
                                      {busDrop.map((point, index) => (
                                        <li
                                          key={index}
                                          className="p-2 border-b bg-white"
                                        >
                                          <label className="flex items-start gap-2 cursor-pointer">
                                            <input
                                              type="radio"
                                              name="drop"
                                              checked={
                                                selectedDrop["drop"]
                                                  ?.Dropping_Id ===
                                                point.Dropping_Id
                                              }
                                              onChange={() =>
                                                handleDropSelection(
                                                  "drop",
                                                  point
                                                )
                                              }
                                              className="accent-yellow-600 mt-1"
                                            />
                                            <div>
                                              <p className="font-semibold">
                                                {point.Dropping_Name}
                                              </p>
                                              <p className="text-sm text-gray-600">
                                                {point.Dropping_Address}
                                              </p>
                                              <p className="text-sm text-gray-600">
                                                Landmark:{" "}
                                                {point.Dropping_Landmark}
                                              </p>
                                              <p className="text-sm text-gray-600">
                                                Contact:{" "}
                                                {point.Dropping_Contact}
                                              </p>
                                              <p className="text-sm text-gray-600">
                                                Time: {point.Dropping_Time}
                                              </p>
                                            </div>
                                          </label>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>

                                <div className="absolute p-2 bottom-0 w-full border-t">
                                  <div>
                                    <p className="text-black font-semibold text-lg">
                                      Selected Seats
                                    </p>
                                    <p>No Seats selected yet</p>
                                  </div>
                                  <button className="bg-yellow text-white text-lg font-semibold w-full rounded-lg py-2">
                                    Continue
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-500 p-4">
                <Ban size={50} className="mb-2 text-red-500" />{" "}
                {/* No buses icon */}
                <p>No buses available at the moment.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
