"use client";

import FilterModal from "@/components/FilterModal";
import FlightBooking from "@/components/flight/flight-booking";
import { FlightVector } from "@/components/icons";
import Simmer from "@/components/layout/simmer";
import Button from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox";
import { airports } from "@/constants/data/airports";
import { Time } from "@/constants/data/time";
import { apiService } from "@/lib/api";
import { Slider, Typography } from "@mui/material";
import { format } from "date-fns";
import { Filter } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedTripType, setSelectedTripType] = useState("One Way");
  const [selectedFareType, setSelectedFareType] = useState("Regular");
  const [viewPriceSection, setViewPriceSection] = useState(false);
  const [viewDetailsSection, setViewDetailsSection] = useState(false);
  const [flightData, setFlightData] = useState([]);
  const [searchKey, setSearchKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFlightIndex, setActiveFlightIndex] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [cities, setCities] = useState([]);
  const [countryCode, setCountryCode] = useState(null);
  const [travelerCounts, setTravelerCounts] = useState({
    a: 0,
    c: 0,
    i: 0,
    tp: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPrice, setSelectedPrice] = useState(30000);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenFilter, setModalOpenFilter] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [deltaX, setDeltaX] = useState(0);
  const [visibleCards, setVisibleCards] = useState(1);
  const [cardWidth, setCardWidth] = useState(100);
  const [selectedFareDetails, setSelectedFareDetails] = useState(null);
  const [fareOneDetails, setFareOneDetails] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedStops, setSelectedStops] = useState([0, 1, 2, 3]);
  const [firstLoad, setFirstLoad] = useState(true);
  const [originTime, setOriginTime] = useState(null);
  const [destinationTime, setDestinationTime] = useState(null);

  const [selectedAirlines, setSelectedAirlines] = useState([
    { Airline_Code: "" },
  ]);

  const handleModalToggle = () => {
    setModalOpenFilter(!isModalOpenFilter);
  };

  const handleOriginTime = (index) => {
    if (originTime === index) {
      setOriginTime(null);
    } else {
      setOriginTime(index);
    }
  };
  const handleDestinationTime = (index) => {
    if (destinationTime === index) {
      setDestinationTime(null);
    } else {
      setDestinationTime(index);
    }
  };
  const handleChange = (event, newValue) => {
    setSelectedPrice(newValue);
  };
  const handleCheckboxChange = (event, airlineCode) => {
    if (event.target.checked) {
      setSelectedAirlines([...selectedAirlines, { Airline_Code: airlineCode }]);
    } else {
      setSelectedAirlines(
        selectedAirlines.filter(
          (airline) => airline.Airline_Code !== airlineCode
        )
      );
    }
  };

  const getStops = (segments) => {
    const stops = segments
      .slice(0, -1)
      .map((segment) => segment.Destination_City);

    if (stops.length === 0) {
      return "Direct Flight";
    }

    return `${stops.length} stop${stops.length > 1 ? "s" : ""} via ${stops.join(
      ", "
    )}`;
  };

  const getLowestBasicAmount = (fares) => {
    let lowestAmount = Infinity;

    fares.forEach((fare, index) => {
      fare.FareDetails.forEach((details) => {
        if (details.Basic_Amount < lowestAmount) {
          lowestAmount = details.Basic_Amount;
        }
      });
    });

    return lowestAmount;
  };

  const handleNonStop = () => {
    setSelectedStops([0]);
  };

  const handleOneStop = () => {
    setSelectedStops([0, 1]);
  };

  const handleReset = () => {
    setSelectedStops([0, 1, 2, 3]);
  };
  const cards = Array(5).fill();

  useEffect(() => {
    const updateResponsiveSettings = () => {
      const width = window.innerWidth;

      if (width < 650) {
        setVisibleCards(1);
        setCardWidth(100);
      } else if (width >= 650 && width < 1024) {
        setVisibleCards(2);
        setCardWidth(50);
      } else {
        setVisibleCards(3);
        setCardWidth(33.33);
      }
    };

    updateResponsiveSettings();
    window.addEventListener("resize", updateResponsiveSettings);

    // Cleanup event listener
    return () => window.removeEventListener("resize", updateResponsiveSettings);
  }, []);

  // Navigation Handlers
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - visibleCards) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Drag/Swipe Handlers (unchanged)
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (isDragging) {
      setDeltaX(e.touches[0].clientX - startX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (deltaX > 50 && currentIndex > 0) {
      handlePrev();
    } else if (deltaX < -50 && currentIndex < cards.length - visibleCards) {
      handleNext();
    }
    setDeltaX(0);
  };

  // Function to open the modal
  const openModal = (fareDetails, flightItem) => {
    setFareOneDetails(flightItem), setSelectedFareDetails(fareDetails);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Function to generate next 7 days with prices
  const generateDatePrices = () => {
    const today = new Date();
    let dates = [];
    for (let i = 0; i < 15; i++) {
      const newDate = new Date(today);
      newDate.setDate(today.getDate() + i);
      dates.push({
        id: format(newDate, "EEE, dd MMM"),
        price: (10000 + i * 5000).toString(),
      });
    }
    return dates;
  };

  const datePrice = generateDatePrices();

  const handleSelectDate = (date, price) => {
    const currentYear = new Date().getFullYear();
    let fullDateString = date;

    if (date && !date.includes(currentYear)) {
      fullDateString = `${date} ${currentYear}`;
    }

    const selectedDateObj = new Date(fullDateString);

    if (isNaN(selectedDateObj.getTime())) {
      console.error("Invalid date detected:", fullDateString);
      return;
    }

    setSelectedDate(selectedDateObj);
    setSelectedPrice(price);
  };

  useEffect(() => {
    const tripInfo = searchParams.get("tripInfo");
    const travelcount = searchParams.get("travelcount");
    const countryCodeFromUrl = searchParams.get("countryCode");

    if (tripInfo) {
      try {
        const decodedTripInfo = decodeURIComponent(
          decodeURIComponent(tripInfo)
        );
        const parsedCities = JSON.parse(decodedTripInfo);
        setCities(parsedCities);
      } catch (error) {
        console.error("Error parsing tripInfo:", error);
      }
    }
    if (travelcount) {
      try {
        const parsedTravelCount = JSON.parse(decodeURIComponent(travelcount));
        setTravelerCounts(parsedTravelCount);
      } catch (error) {
        console.error("Error parsing travelcount:", error);
      }
    }
    if (countryCodeFromUrl !== null) {
      setCountryCode(parseInt(countryCodeFromUrl)); // Set the countryCode in state
    }
    setIsLoading(false);
  }, [searchParams]);

  const getCityName = (code) => {
    // Retrieve city data from localStorage
    const cityData = JSON.parse(localStorage.getItem("cityData"));

    if (cityData) {
      const airport = cityData.find((airport) => airport.iata_code === code);

      if (airport) {
        return airport.municipality;
      } else {
        console.log(`City not found for code: ${code}`, cityData);
        return "Unknown";
      }
    } else {
      console.log("City data not available in localStorage.");
      return "Unknown";
    }
  };

  const handleViewPriceSection = (index) => {
    setActiveFlightIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  const handleCloseSheet = () => {
    setSelectedFlight(null);
  };
  const handleFlightDetailsSection = (flight, index) => {
    if (selectedFlight !== flight) {
      localStorage.setItem("searchKey", JSON.stringify(searchKey));
      setSelectedFlight(flight);
      setSelectedIndex(index === "" || index == null ? 0 : index);
      setViewDetailsSection(true);
    } else {
      setViewDetailsSection((prev) => !prev);
    }
  };

  const calculateTotalDuration = (segments) => {
    let totalMinutes = 0;

    segments.forEach((segment) => {
      const [hours, minutes] = segment.Duration.split(":").map(Number);
      totalMinutes += hours * 60 + minutes;
    });

    // Convert total minutes to hours and minutes
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    return `${totalHours}h ${remainingMinutes}m`;
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      weekday: "short", // "Sat"
      day: "2-digit", // "21"
      month: "short", // "Dec"
      year: "2-digit", // "24"
    });
  };
  const tripTypes = ["One Way", "Round Trip", "Multiple City"];

  
  const handleFlightSearch = useCallback(async (updatedCities) => {
    if (updatedCities.length === 0) {
      setError("No cities selected.");
      setLoading(false);
      setFilterLoading(false);
      return;
    }

    // Ensure the TravelDate is formatted properly before sending to the API
    const formattedCities = updatedCities.map((city) => ({
      Origin: city.Origin,
      Destination: city.Destination,
      TravelDate: format(new Date(city.TravelDate), "MM/dd/yyyy"),
    }));

    const { a, c, i, tp } = travelerCounts;

    try {
      const response = await apiService.post("/flight/searchFlight", {
        Travel_Type: countryCode,
        Booking_Type: 0,
        TripInfo: formattedCities,
        Adult_Count: a.toString(),
        Child_Count: c.toString(),
        Infant_Count: i.toString(),
        Class_Of_Travel: tp.toString(),
        Filtered_Airline: selectedAirlines,
        stops: selectedStops,
        priceRange: { min: 0, max: selectedPrice },
        departureFromOrigin: destinationTime,
        arrivalAtDestination: originTime,
        sort: { name: "price", method: "desc" },
      });

      setSearchKey(response.data.Search_Key);
      setFlightData(response.data.TripDetails);
      setLoading(false);
      setFilterLoading(false);

      if (firstLoad) {
        setFirstLoad(false);
      }
    } catch (error) {
      console.error("Error fetching flight data:", error);
      setError("Failed to fetch flight data");
      setLoading(false);
      setFilterLoading(false);
    }
  }, [countryCode, travelerCounts, selectedAirlines, selectedStops, selectedPrice, destinationTime, originTime, firstLoad]);
  useEffect(() => {
    if (cities.length > 0 && selectedDate) {
      // Update the cities with the selected date
      const updatedCities = cities.map((city) => ({
        ...city,
        TravelDate: format(selectedDate, "MM/dd/yyyy"),
      }));

      // If it's the first load, show loading indicator
      if (firstLoad) {
        setLoading(true);
      }

      // Show filter loading when filters are updated
      setFilterLoading(true);

      // Call API with the updated cities
      handleFlightSearch(updatedCities);
    }
  }, [
    selectedDate,
    cities,
    selectedStops,
    selectedAirlines,
    selectedPrice,
    originTime,
    destinationTime,
    firstLoad,
    handleFlightSearch, // Include handleFlightSearch to avoid stale closures
  ]);
  const AirlineDetails = ({ airlineName, seatAvailability }) => (
    <div>
      <p className="text-base font-semibold">{airlineName}</p>
      <p className="text-sm text-gray-500">AO 465, AI 164</p>
      <p className="text-sm text-blue-500 font-medium">Economy</p>
      <p className="text-sm text-green-600">
        {seatAvailability} seat(s) available
      </p>
    </div>
  );

  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col gap-4">
      {/* mobile filters */}

      <div className="bg-yellow flex items-center justify-between lg:hidden py-4 px-3 md:px-10 shadow-lg">
        <span className="flex items-center gap-3">
          <button>
            <Image src="/icons/arrow.png" className="w-4 h-4 md:h-6 md:w-6" width={16} height={16} alt="Flight img" />
          </button>
          {cities.length > 0 ? (
            cities.map((info, index) => (
              <p key={index} className="text-white font-semibold text-lg">
                {getCityName(info.Origin)} To {getCityName(info.Destination)}
              </p>
            ))
          ) : (
            <p>Loading flight information...</p>
          )}
        </span>

        <button onClick={handleModalToggle}>
          <Image src="/icons/filter.png" className="w-6 h-6" width={16} height={16} alt="Flight img" />
        </button>
      </div>
      <FilterModal
        isOpen={isModalOpenFilter}
        onClose={handleModalToggle}
        selectedStops={selectedStops}
        setSelectedStops={setSelectedStops}
        selectedPrice={selectedPrice}
        setSelectedPrice={setSelectedPrice}
        setOriginTime={setOriginTime}
        setDestinationTime={setDestinationTime}
        setSelectedAirlines={setSelectedAirlines}
      />
      {/* Trip Type Selection */}
      <div className=" bg-white shadow-sm py-10 px-20 overflow-x-auto hidden lg:block">
        <div className="flex items-center gap-4">
          {tripTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedTripType(type)}
              className={`text-xs flex items-center gap-2 rounded-full p-2 ${
                selectedTripType === type ? "bg-yellow/10" : ""
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full ${
                  selectedTripType === type ? "bg-yellow" : "bg-white"
                }`}
              ></span>
              <p>{type}</p>
            </button>
          ))}
        </div>

        {/* Flight Search Details */}
        {cities.length > 0 ? (
          cities.map((info, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 mt-5 "
            >
              <div className="border rounded-l-xl p-4">
                <p className="text-sm">From</p>
                <p className="text-md font-semibold">
                  {getCityName(info.Origin)}
                </p>
              </div>
              <div className="border p-4">
                <p className="text-sm">To</p>
                <p className="text-md font-semibold">
                  {getCityName(info.Destination)}
                </p>
              </div>
              <div className="border p-4">
                <p className="text-sm">Departure</p>
                <p className="text-md font-semibold">
                  {format(new Date(info.TravelDate), "EEE, dd MMM")}
                </p>
              </div>
              <div className="border p-4">
                <p className="text-sm">Return</p>
              </div>
              <div className="border p-4">
                <p className="text-sm">Travellers & Class</p>
                <p className="text-md font-semibold">
                  {travelerCounts.a + travelerCounts.c + travelerCounts.i}{" "}
                  Travellers,{" "}
                  {
                    ["Economy", "Premium Economy", "Business", "First Class"][
                      travelerCounts.tp
                    ]
                  }
                </p>
              </div>
              <div className="border p-4 rounded-r-xl flex items-center justify-center">
                <Button onClick={() => router.back()}>Modify</Button>
              </div>
            </div>
          ))
        ) : (
          <p>Loading flight information...</p>
        )}
      </div>
      {/* Fare Type Selection */}
      {/* <div className=" bg-white py-4 px-20 shadow-sm">
        <p className="text-xs">Special Fares (Optional):</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedFareType("Regular")}
            className={`text-xs flex items-center gap-2 rounded-full px-4 py-1 mt-2 ${
              selectedFareType === "Regular"
                ? "bg-yellow text-white"
                : "border px-4 py-1"
            }`}
          >
            <p>Regular</p>
          </button>
          <button
            onClick={() => setSelectedFareType("Senior Citizen")}
            className={`text-xs flex items-center gap-2 rounded-full px-4 py-1 mt-2 ${
              selectedFareType === "Senior Citizen"
                ? "bg-yellow text-white"
                : "border px-4 py-1"
            }`}
          >
            <p>Senior Citizen</p>
          </button>
        </div>
      </div> */}

      {/* Filters and Results */}
      <div className="md:px-20 px-3 flex gap-4 ">
        {/* Filters Section */}
        <div className="bg-white rounded-xl p-4 w-full sm:w-1/4 lg:w-1/6 hidden lg:block">
          <div className="flex justify-between items-center">
            <Filter />
            <button onClick={handleReset}>
              <p className="text-sm cursor-pointer text-blue-600">Clear All</p>
            </button>
          </div>
          <div className="mt-4">
            <p className="text-sm font-semibold">Stops</p>

            {/* Non-Stop Button */}
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm">Non-Stop</p>
              <button
                onClick={handleNonStop}
                className={`h-6 w-6 border rounded-full`}
                style={{
                  backgroundColor:
                    selectedStops.length == 1 ? "#FFA500" : "transparent",
                }}
              ></button>
            </div>

            {/* 1-Stop Button */}
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm">1-Stop</p>
              <button
                onClick={handleOneStop}
                className={`h-6 w-6 border rounded-full`}
                style={{
                  backgroundColor:
                    selectedStops.length == 2 ? "#FFA500" : "transparent",
                }}
              >
                {/* 1-Stop */}
              </button>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm font-semibold">Flight Price</p>
            <div className="flex justify-between items-center mt-2">
              <input
                type="text"
                placeholder="Min"
                className="border rounded-md p-2 w-full"
              />
            </div>
          </div>

          <div className="mt-8">
            <p>Flight price</p>
            <Slider
              aria-label="Small steps"
              step={1000}
              min={8000}
              max={50000}
              valueLabelDisplay="auto"
              value={selectedPrice}
              onChange={handleChange}
              sx={{
                color: "#FF8E00",
                height: 8,
                "& .MuiSlider-thumb": {
                  backgroundColor: "#ffffff",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)",
                  width: 20,
                  height: 20,
                  "&:hover": {
                    backgroundColor: "#ffffff",
                  },
                },
                "& .MuiSlider-track": {
                  backgroundColor: "#FF8E00",
                  height: 8,
                },
                "& .MuiSlider-rail": {
                  backgroundColor: "#DCDCDC",
                  height: 8,
                },
                "& .MuiSlider-valueLabel": {
                  backgroundColor: "#1a68ab",
                  color: "white",
                },
              }}
            />
          </div>

          <span className="flex items-center justify-between">
            <p>₹8000</p>
            <p>₹{selectedPrice}</p>
          </span>

          {cities.length > 0 ? (
            cities.map((info, index) => (
              <div key={index} className="mt-8">
                <h3 className="text-sm font-semibold">
                  Departure from {getCityName(info.Origin)}
                </h3>

                <div className="mt-2 flex items-center gap-2">
                  {Time.map((item, index) => (
                    <button key={index}
                      className={`border-2 rounded-xs w-16 h-24 p-1 flex flex-col items-center gap-2 rounded-lg ${
                        originTime == index ? "border-yellow" : ""
                      }`}
                      onClick={() => {
                        handleOriginTime(index);
                      }}
                    >
                      <Image src={item.image} className="w-8 h-8" width={16} height={16} alt="Flight img" />
                      <span className="text-xs font-medium">{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>Loading flight information...</p>
          )}

          {cities.length > 0 ? (
            cities.map((info, index) => (
              <div key={index} className="mt-8">
                <h3 className="text-sm font-semibold">
                  Departure from {getCityName(info.Destination)}
                </h3>

                <div className="mt-2 flex items-center gap-2">
                  {Time.map((item, index) => (
                    <button key={index}
                      className={`border-2 rounded-xs w-16 h-24 p-1 flex flex-col items-center gap-2 rounded-lg ${
                        destinationTime == index ? "border-yellow" : ""
                      }`}
                      onClick={() => {
                        handleDestinationTime(index);
                      }}
                    >
                      <Image src={item.image} className="w-8 h-8" width={16} height={16} alt="Flight img" />
                      <span className="text-xs font-medium">{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>Loading flight information...</p>
          )}

          <div className="mt-4">
            <p className="text-sm font-semibold">Airlines</p>
            <div className="flex items-center space-x-2 mt-2 gap-3">
              {/* Air India Checkbox */}
              <input
                type="checkbox"
                id="air-india"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                onChange={(e) => handleCheckboxChange(e, "AI")}
              />
              <label
                htmlFor="air-india"
                className="flex items-center space-x-2"
              >
                <Image src="/icons/airIndiaIcon.png" className="w-6 h-6" width={16} height={16} alt="Flight img" />
                <p className="text-gray-600 text-lg font-medium">Air India</p>
              </label>
            </div>

            <div className="flex items-center space-x-2 mt-2 gap-3">
              {/* IndiGo Checkbox */}
              <input
                type="checkbox"
                id="indigo"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                onChange={(e) => handleCheckboxChange(e, "6E")}
              />
              <label htmlFor="indigo" className="flex items-center space-x-2">
                <Image src="/icons/indiGoIcon.png" className="w-6 h-6 object-contain" width={24} height={24}  alt="Flight img" />
                <p className="text-gray-600 text-lg font-medium">IndiGo</p>
              </label>
            </div>

            <div className="flex items-center space-x-2 mt-2 gap-3">
              {/* SpiceJet Checkbox */}
              <input
                type="checkbox"
                id="spicejet"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                onChange={(e) => handleCheckboxChange(e, "SG")}
              />
              <label htmlFor="spicejet" className="flex items-center space-x-2">
                <Image src="/icons/SG.png" className="w-6 h-6 rounded-full" width={16} height={16} alt="Flight img" />
                <p className="text-gray-600 text-lg font-medium">SpiceJet</p>
              </label>
            </div>
          </div>
        </div>

        {/* Flight Options Section */}
        {loading ? (
          <Simmer />
        ) : (
          <div className="flex-1 p-1  rounded-xl m w-1/2 mt-1 md:mt-0 mb-10">
            <div className="flex items-center bg-white rounded-lg shadow-lg">
              {/* Left Arrow */}
              <button
                onClick={() =>
                  document.getElementById("scrollable-container").scrollBy({
                    left: -100,
                    behavior: "smooth",
                  })
                }
                className="pl-4 h-16 w-16 md:w-10 md:h-10"
              >
                <Image src="/icons/leftArrow.png" width={16} height={16} alt="Flight img" />
              </button>

              {/* Scrollable Container */}
              <div
                id="scrollable-container"
                className="overflow-x-auto whitespace-nowrap flex items-center  mx-4 px-1 scrollbar-hide"
                style={{ scrollBehavior: "smooth" }}
              >
                {datePrice.map((item) => (
                  <div
                    key={item.id}
                    className={`flex justify-between items-center px-4 py-2 border-r text-xs flex-col sm:w-auto w-full ${
                      format(selectedDate, "EEE, dd MMM") === item.id
                        ? "border-yellow border"
                        : ""
                    }`}
                    onClick={() => handleSelectDate(item.id, item.price)}
                  >
                    <p className="text-neutral-400 font-medium text-sm">
                      {item.id}
                    </p>
                    <p className="font-medium text-sm">{item.price}</p>
                  </div>
                ))}
              </div>

              {/* Right Arrow */}
              <button
                onClick={() =>
                  document.getElementById("scrollable-container").scrollBy({
                    left: 100,
                    behavior: "smooth",
                  })
                }
                className="pr-4 h-16 w-16 md:w-10 md:h-10"
              >
                <Image src="/icons/rightArrow.png" width={16} height={16} alt="Flight img" />
              </button>
            </div>
            {cities.length > 0 ? (
              cities.map((info, index) => (
                <h1 key={index} className="text-lg md:text-2xl font-semibold mt-5">
                  Flights from {getCityName(info.Origin)} to{" "}
                  {getCityName(info.Destination)}
                </h1>
              ))
            ) : (
              <p>Loading flight information...</p>
            )}
            <div>
              {filterLoading ? (
                <div className="mb-10">
                  <div className="skeleton-loader">
                    <div className="skeleton-item1"></div>
                    <div className="skeleton-item2"></div>
                  </div>
                  <div className="skeleton-loader">
                    <div className="skeleton-item1"></div>
                    <div className="skeleton-item2"></div>
                  </div>
                </div>
              ) : flightData && flightData.length > 0 ? (
                flightData.map((trip, i) => (
                  <div key={i}>
                    {trip.Flights && trip.Flights.length > 0 ? (
                      trip.Flights.map((flightItem, index) => (
                        <div
                          className="bg-white p-6 rounded-xl shadow mt-4 flex flex-col gap-4 mb-3"
                          key={index}
                        >
                          <div className="flex md:flex-row items-center justify-between gap-6 md:gap-10">
                            <div className="flex items-center gap-4 min-w-fit">
                            <Image
  src={
    flightItem.Segments[0]?.Airline_Name === "IndiGo"
      ? "/icons/indiGo.png"
      : "/icons/airIndia.png"
  }
  width={100}  // Set desired width here
  height={100}  // Set desired height here
  alt="Airline Logo"
  className="w-full h-full md:w-24 md:h-24 object-contain"
/>
                              <div>
                                <p className="md:text-xl md:font-semibold font-medium text-sm">
                                  {flightItem.Segments[0]?.Airline_Name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {flightItem.Segments[0]?.Aircraft_Type}{" "}
                                  {flightItem.Segments[0]?.Flight_Number}
                                </p>
                                <p className="text-sm text-blue-500 font-medium">
                                  {flightItem.Fares[0].ProductClass === "O" &&
                                    "Economy"}
                                  {flightItem.Fares[0].ProductClass === "J" &&
                                    "Business"}
                                  {flightItem.Fares[0].ProductClass === "R" &&
                                    "Premium"}
                                </p>
                                {/* <p className="text-sm text-green-600">
                            {item.Fares[0].Seats_Available} seat(s) available
                          </p> */}
                              </div>
                            </div>
                            <div className="flex items-center gap-5 hidden md:flex">
                              <div className="flex flex-col items-center">
                                <h2 className="md:text-2xl font-semibold text-black">
                                  {
                                    flightItem.Segments[0].Departure_DateTime.split(
                                      " "
                                    )[1]
                                  }
                                </h2>
                                <p className="md:text-sm font-medium text-gray-500">
                                  {flightItem.Segments[0].Origin}
                                </p>
                              </div>
                              <div className="flex flex-col items-center gap-4">
                                <div className="flex items-center gap-5 mt-4">
                                  <div className="border border-dashed w-20"></div>
                                  <Image
                                    src="/icons/plan.png"
                                    alt="Flight Plan"
                                    width={16} height={16}
                                  />
                                  <div className="border border-dashed w-20"></div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-semibold">
                                    {calculateTotalDuration(
                                      flightItem.Segments
                                    )}
                                  </p>
                                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <span className="w-1.5 h-1.5 bg-black rounded-full"></span>{" "}
                                    {/* Bullet for "Direct" */}
                                    <p className="text-gray-500 text-sm font-medium">
                                      {getStops(flightItem.Segments)}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col items-center">
                                <h2 className="md:text-2xl font-semibold text-black">
                                  {
                                    flightItem.Segments[
                                      flightItem.Segments.length - 1
                                    ].Arrival_DateTime.split(" ")[1]
                                  }
                                </h2>
                                <p className="md:text-sm font-medium text-gray-500">
                                  {
                                    flightItem.Segments[
                                      flightItem.Segments.length - 1
                                    ].Destination
                                  }
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col items-end">
                              <p className="md:text-xl font-bold text-red-600">
                                ₹{getLowestBasicAmount(flightItem.Fares)}
                              </p>
                              <p className="text-sm text-gray-400 line-through">
                                ₹46,000
                              </p>
                              <button
                                className={`text-xs flex items-center gap-2 rounded-full px-2 py-1 bg-yellow/20 border-2 border-yellow-500 mt-1`}
                                onClick={() =>
                                  openModal(flightItem.Fares, flightItem)
                                }
                              >
                                VIEW FARE
                              </button>
                              {isModalOpen && (
                                <div
                                  className="fixed inset-0 flex items-center justify-center z-50 bg-black/5"
                                  onClick={closeModal}
                                >
                                  <div
                                    className="bg-white rounded-xl w-11/12 sm:w-1/1 lg:w-2/3"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="flex justify-between items-center mb-4 p-4 shadow-lg">
                                      <div className="flex items-center gap-2">
                                        <h1 className="text-sm sm:text-lg text-yellow font-semibold">
                                          {selectedFareDetails.length} FARE
                                          OPTIONS
                                        </h1>
                                        <h2 className="text-sm sm:text-lg font-semibold">
                                          available for your trip.
                                        </h2>
                                      </div>

                                      <button
                                        onClick={closeModal}
                                        className="text-gray-600 hover:text-gray-800 p-2 rounded-full"
                                      >
                                        <FaTimes className="w-6 h-6" />
                                      </button>
                                    </div>
                                    <div className="p-4">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <h2 className="text-xs sm:text-sm md:text-base text-gray-600 font-semibold">
                                          {
                                            fareOneDetails.Segments[0]
                                              .Origin_City
                                          }{" "}
                                          →{" "}
                                          {
                                            fareOneDetails.Segments[
                                              fareOneDetails.Segments.length - 1
                                            ].Destination_City
                                          }
                                        </h2>
                                        <h2 className="text-xs sm:text-sm md:text-base text-gray-600 font-semibold">
                                          {
                                            fareOneDetails.Segments[0]
                                              ?.Airline_Name
                                          }
                                           · 
                                          {formatDate(
                                            flightItem.Segments[0]
                                              .Departure_DateTime
                                          )}
                                           · Departure at{" "}
                                          {
                                            fareOneDetails.Segments[0].Departure_DateTime.split(
                                              " "
                                            )[1]
                                          }{" "}
                                          - Arrival at{" "}
                                          {
                                            fareOneDetails.Segments[
                                              fareOneDetails.Segments.length - 1
                                            ].Arrival_DateTime.split(" ")[1]
                                          }
                                        </h2>
                                      </div>

                                      <div className="flex items-center justify-center gap-4 mt-3 overflow-hidden relative">
                                        <div
                                          className="flex transition-transform duration-300 md:p-4 md:gap-3"
                                          style={{
                                            transform: `translateX(calc(-${
                                              currentIndex *
                                              (100 / visibleCards)
                                            }% + ${deltaX}px))`,
                                            width: `calc(${cardWidth}% * ${visibleCards})`,
                                          }}
                                          onTouchStart={handleTouchStart}
                                          onTouchMove={handleTouchMove}
                                          onTouchEnd={handleTouchEnd}
                                          onMouseDown={(e) => {
                                            setIsDragging(true);
                                            setStartX(e.clientX);
                                          }}
                                          onMouseMove={(e) => {
                                            if (isDragging) {
                                              setDeltaX(e.clientX - startX);
                                            }
                                          }}
                                          onMouseUp={() => {
                                            setIsDragging(false);
                                            if (
                                              deltaX > 50 &&
                                              currentIndex > 0
                                            ) {
                                              handlePrev();
                                            } else if (
                                              deltaX < -50 &&
                                              currentIndex <
                                                cards.length - visibleCards
                                            ) {
                                              handleNext();
                                            }
                                            setDeltaX(0); // Reset deltaX
                                          }}
                                          onMouseLeave={() =>
                                            setIsDragging(false)
                                          }
                                        >
                                          {selectedFareDetails.map(
                                            (fareItem, indexItem) => (
                                              <div
                                                key={index}
                                                className="flex-shrink-0 border rounded-md shadow-md bg-white"
                                                style={{
                                                  width: `calc(100% / ${visibleCards})`,
                                                }}
                                              >
                                                <div className="p-4">
                                                  <div className="flex items-baseline gap-1">
                                                    <h1 className="text-black text-xl font-semibold">
                                                      ₹
                                                      {
                                                        fareItem.FareDetails[0]
                                                          .Basic_Amount
                                                      }
                                                    </h1>
                                                    <p className="text-sm text-gray-500 font-medium">
                                                      per adult
                                                    </p>
                                                  </div>
                                                  <p className="text-sm text-gray-500 font-medium">
                                                    ECO VALUE
                                                  </p>
                                                </div>
                                                <div className="border-b-2"></div>
                                                <div className="p-4">
                                                  <div className="mb-5">
                                                    <h4 className="text-sm font-medium text-black">
                                                      Baggage
                                                    </h4>
                                                    <ul className="mt-2">
                                                      <li className="flex items-center gap-2">
                                                        <Image
                                                          className="w-5"
                                                          src="/icons/mark.png"
                                                          alt="Flight img"
                                                          width={16}
                                                          height={16}
                                                          
                                                        />
                                                        <span className="text-sm font-light text-black">
                                                          {
                                                            fareItem
                                                              .FareDetails[0]
                                                              .Free_Baggage
                                                              .Hand_Baggage
                                                          }
                                                          kg cabin baggage
                                                        </span>
                                                      </li>
                                                      <li className="flex items-center gap-2">
                                                        <Image
                                                          className="w-5"
                                                          src="/icons/mark.png"
                                                          alt="Flight img"
                                                          width={16}
                                                          height={16}
                                                        />
                                                        <span className="text-sm font-light text-black">
                                                          {
                                                            fareItem
                                                              .FareDetails[0]
                                                              .Free_Baggage
                                                              .Check_In_Baggage
                                                          }{" "}
                                                          check-in baggage
                                                        </span>
                                                      </li>
                                                    </ul>
                                                  </div>
                                                  <div className="mb-5">
                                                    <h4 className="text-sm font-medium text-black">
                                                      Flexibility
                                                    </h4>
                                                    <ul className="mt-2">
                                                      <li className="flex items-center gap-2">
                                                        <Image
                                                          className="w-5"
                                                          src="/icons/minus.png"
                                                          alt="Flight img"
                                                          width={16}
                                                          height={16}
                                                        />
                                                        <span className="text-sm font-light text-black">
                                                          Cancellation fee
                                                          starts at ₹4,000 (up
                                                          to 2 hours before
                                                          departure)
                                                        </span>
                                                      </li>
                                                      <li className="flex items-center gap-2">
                                                        <Image
                                                          className="w-5"
                                                          src="/icons/minus.png"
                                                          alt="Flight img"
                                                          width={16}
                                                          height={16}
                                                        />
                                                        <span className="text-sm font-light text-black">
                                                          Date Change fee starts
                                                          at ₹3,250 up to 2 hrs
                                                          before departure
                                                        </span>
                                                      </li>
                                                    </ul>
                                                  </div>
                                                  <div className="mb-5">
                                                    <h4 className="text-sm font-medium text-black">
                                                      Seats, Meals & More
                                                    </h4>
                                                    <ul className="mt-2">
                                                      <li className="flex items-center gap-2">
                                                        <Image
                                                          className="w-5"
                                                          src="/icons/mark.png"
                                                          alt="Flight img"
                                                          width={16}
                                                          height={16}
                                                        />
                                                        <span className="flex text-sm font-medium gap-1">
                                                          <span className="text-yellow">
                                                            Free
                                                          </span>
                                                          <span className="text-blue-500">
                                                            Seats
                                                          </span>
                                                        </span>
                                                      </li>
                                                      <li className="flex items-center gap-2">
                                                        <Image
                                                          className="w-5"
                                                          src="/icons/mark.png"
                                                          alt="Flight img"
                                                          width={16}
                                                          height={16}
                                                        />
                                                        <span className="flex text-sm font-medium gap-1">
                                                          <span className="text-yellow">
                                                            Complimentary
                                                          </span>
                                                          <span className="text-blue-500">
                                                            Meals
                                                          </span>
                                                        </span>
                                                      </li>
                                                    </ul>
                                                  </div>
                                                  <div className="flex items-center justify-end gap-2 mt-10">
                                                    <button className="border-2 border-yellow text-yellow font-medium py-1 px-3 rounded-[20px] shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
                                                      Lock Price
                                                    </button>
                                                    <button
                                                      className="bg-yellow text-white font-medium py-1 px-3 rounded-[20px] shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
                                                      onClick={() =>
                                                        handleFlightDetailsSection(
                                                          fareOneDetails,
                                                          indexItem
                                                        )
                                                      } // Pass flightItem only
                                                    >
                                                      Book Now
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            )
                                          )}
                                        </div>
                                        <button
                                          onClick={handlePrev}
                                          className={`absolute top-1/2 left-4 transform -translate-y-1/2 bg-black text-white p-2 rounded-full ${
                                            currentIndex === 0
                                              ? "opacity-50 cursor-not-allowed"
                                              : ""
                                          }`}
                                          disabled={currentIndex === 0}
                                        >
                                          &lt;
                                        </button>
                                        <button
                                          onClick={handleNext}
                                          className={`absolute top-1/2 right-4 transform -translate-y-1/2 bg-black text-white p-2 rounded-full ${
                                            currentIndex >=
                                            cards.length - visibleCards
                                              ? "opacity-50 cursor-not-allowed"
                                              : ""
                                          }`}
                                          disabled={
                                            currentIndex >=
                                            cards.length - visibleCards
                                          }
                                        >
                                          &gt;
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-center gap-5 md:flex md:hidden">
                            <div className="flex flex-col items-center">
                              <h2 className="md:text-2xl font-semibold text-black">
                                {
                                  flightItem.Segments[0].Departure_DateTime.split(
                                    " "
                                  )[1]
                                }
                              </h2>
                              <p className="md:text-sm font-medium text-gray-500">
                                {flightItem.Segments[0].Origin}
                              </p>
                            </div>
                            <div className="flex flex-col items-center gap-4">
                              <div className="flex items-center gap-5 mt-4">
                                <div className="border border-dashed w-20"></div>
                                <Image src="/icons/plan.png" alt="Flight Plan" width={16} height={16} />
                                <div className="border border-dashed w-20"></div>
                              </div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold">
                                  {calculateTotalDuration(flightItem.Segments)}
                                </p>
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                  <span className="w-1.5 h-1.5 bg-black rounded-full"></span>{" "}
                                  {/* Bullet for "Direct" */}
                                  <p className="text-gray-500 text-sm font-medium">
                                    Direct
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-center">
                              <h2 className="md:text-2xl font-semibold text-black">
                                {
                                  flightItem.Segments[
                                    flightItem.Segments.length - 1
                                  ].Arrival_DateTime.split(" ")[1]
                                }
                              </h2>
                              <p className="md:text-sm font-medium text-gray-500">
                                {
                                  flightItem.Segments[
                                    flightItem.Segments.length - 1
                                  ].Destination
                                }
                              </p>
                            </div>
                          </div>

                          <div className="border" />

                          <div className="flex items-center justify-between mt-1">
                            {/* <div className="flex items-center gap-3">
                        <h3>Facilities:</h3>
                        <button className="text-xs border rounded-md px-4 py-1">
                          Facility 1
                        </button>
                        <button className="text-xs border rounded-md px-4 py-1">
                          Facility 2
                        </button>
                      </div> */}
                            <div className="flex items-center gap-3 ">
                              <h3 className="text-green-600">Refundable</h3>
                            </div>
                            <div className="space-x-4">
                              <Button
                                onClick={() =>
                                  handleFlightDetailsSection(flightItem)
                                }
                              >
                                Flight Details
                              </Button>
                            </div>
                          </div>

                          {viewDetailsSection &&
                            selectedFlight === flightItem && (
                              <FlightBooking
                                flightData={selectedFlight}
                                selectedIndex={selectedIndex}
                                onClose={handleCloseSheet}
                              />
                            )}
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center ">
                        <Image
                          src="/icons/noFlightt.png"
                          alt=""
                          className="w-50 h-50"
                        />
                        <p className="text-xl font-semibold">
                          No flight available...
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center ">
                  <Image
                    src="/icons/noFlightt.png"
                    alt="Flight img"
                    className="w-50 h-50"
                  />
                  <p className="text-xl font-semibold">
                    No flight available...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
