"use client";
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox";
import { ArrowRightLeft, PlusCircle, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { airports } from "@/constants/data/airports";
import toast from "react-hot-toast";
import { dates } from "@/constants/data/date";
import { TRAVELLERS_CLASS } from "@/constants/data/flight-data";
import { useRouter } from "next/navigation";
// import { apiService } from "@/lib/api";
import DatePicker from "react-datepicker";
import { addDays, format } from "date-fns";
import { apiService } from "@/lib/api";
import { Input } from "@/components/ui";
import { debounce } from "lodash";
import CustomDropdown from "@/components/dropdown/CustomDropdown";
export default function Home() {
  const router = useRouter();
  const [allCity, setAllCity] = useState([]);
  const [selectedTripType, setSelectedTripType] = useState("One Way");
  const [selectedFareType, setSelectedFareType] = useState("Regular");
  const [departureDate, setDepartureDate] = useState("");
  const ITEMS_PER_PAGE = 20;
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDomestic, setIsDomestic] = useState(0);
  const [travelerCounts, setTravelerCounts] = useState({
    a: 1,
    c: 0,
    i: 0,
    tp: 0,
  });
  const [selectedCities, setSelectedCities] = useState([
    { Origin: "AMD", Destination: "DEL", TravelDate: selectedDate },
  ]);
  const [originCountry, setOriginCountry] = useState("IN");
  const [destinationCountry, setDestinationCountry] = useState("IN");

  const handleOriginCountryChange = (country) => {
    setOriginCountry(country);
  };

  const handleDestinationCountryChange = (country) => {
    setDestinationCountry(country);
  };

  const handleCountChange = (type, value) => {
    setTravelerCounts((prev) => ({
      ...prev,
      [type]: value,
    }));
  };
  const paginatedAirports = airports.slice(0, ITEMS_PER_PAGE * page);

  const handleDateChange = (date) => {
    const formattedDate = format(date, "MM/dd/yyyy");
    setSelectedDate(formattedDate);
  };

  const generateDates = (numDays) => {
    const dates = [];
    for (let i = 0; i < numDays; i++) {
      const date = addDays(new Date(), i);
      dates.push({
        id: i,
        date: format(date, "dd"),
        day: format(date, "EEE"),
      });
    }
    return dates;
  };

  const realDates = generateDates(10);

  const [cities, setCities] = useState([{ id: 1, from: "AMD", to: "BLR" }]);

  function handleCitySwap(id) {
    setCities((prevCities) =>
      prevCities.map((city) =>
        city.id === id ? { ...city, from: city.to, to: city.from } : city
      )
    );
  }

  function handleCityChange(id, field, value, date) {
    setCities((prevCities) => {
      const updatedCities = prevCities.map((city) => {
        if (city.id === id) {
          const updatedCity = { ...city, [field]: value };
          if (field === "TravelDate" && date) {
            updatedCity["TravelDate"] = date;
          }
          return updatedCity;
        }
        return city;
      });

      const selectedCitiesFormatted = updatedCities.map(
        ({ from, to, TravelDate }) => ({
          Origin: from,
          Destination: to,
          TravelDate: selectedDate,
        })
      );

      setSelectedCities(selectedCitiesFormatted);

      return updatedCities;
    });
  }

  const handleRedirect = () => {
    const formattedCityInfo = selectedCities.map((city) => ({
      Origin: city.Origin,
      Destination: city.Destination,
      TravelDate: selectedDate,
    }));

    const cityInfoString = encodeURIComponent(
      JSON.stringify(formattedCityInfo)
    );
    const countryCode =
      originCountry === "IN" && destinationCountry === "IN" ? 0 : 1;

    const queryParams = new URLSearchParams({
      tripInfo: cityInfoString,
    });

    localStorage.setItem("flightInfo", JSON.stringify(formattedCityInfo));

    queryParams.append("travelcount", JSON.stringify(travelerCounts));
    queryParams.append("countryCode", JSON.stringify(countryCode));
    localStorage.setItem("travelerCounts", JSON.stringify(travelerCounts));

    router.push(`/flight-search/page?${queryParams.toString()}`);
  };

  function addCity() {
    const lastCity = cities[cities.length - 1];
    if (!lastCity.to) {
      toast.error('Please select a "To" city before adding a new trip.');
      return;
    }
    const newId = Math.max(...cities.map((city) => city.id)) + 1;
    setCities([...cities, { id: newId, from: lastCity.to, to: "" }]);
    toast.success("New trip added successfully!");
  }

  function removeCity(id) {
    if (cities.length > 2) {
      setCities(cities.filter((city) => city.id !== id));
      toast.success("Trip removed successfully!");
    } else {
      toast.error("At least two cities are required.");
    }
  }

  const allCityData = async (query = "") => {
    try {
      setLoading(true);
      const response = await apiService.get(
        `/flight/searchAirport?search=${query}`
      );
      if (response.success) {
        localStorage.setItem("cityData", JSON.stringify(response.data));
        setAllCity(response.data);
      } else {
        toast.error("Failed to fetch city data");
        console.error("API Error Response:", response);
      }
    } catch (error) {
      toast.error(`Error fetching city data: ${error.message}`);
      console.error("Error fetching city data:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = debounce((query) => {
    allCityData(query);
  }, 300);
  useEffect(() => {
    if (searchQuery.trim()) {
      // If searchQuery has a value, call with it
      allCityData(searchQuery);
    } else {
      // Otherwise, fetch default data
      allCityData();
    }
  }, [searchQuery]);
  useEffect(() => {
    if (searchQuery.trim() !== "") {
      debouncedFetch(searchQuery);
    }
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch, searchQuery]);
  const handleCityChangess = (type, value) => {
    setSelectedCities((prevState) => {
      return prevState.map((city) => {
        if (type === "Origin") {
          return { ...city, Origin: value };
        } else if (type === "Destination") {
          return { ...city, Destination: value };
        }
        return city;
      });
    });
  };

  const renderCityCards = () => {
    return cities.map((city, index) => (
      <div
        key={city.id}
        className="rounded-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 mb-6 relative"
      >
        <div className="border p-6 rounded-l-xl relative hover:bg-yellow/10 transition-all duration-300 cursor-pointer">
          <p className="text-xs sm:text-sm text-neutral-400">From</p>
          <Select
            value={city.from}
            onValueChange={(value) => handleCityChange(city.id, "from", value)}
          >
            <SelectTrigger className="w-full sm:w-[280px]">
              <SelectValue placeholder="Select a city" />
            </SelectTrigger>
            <SelectContent>
              {paginatedAirports.map((airport) => (
                <SelectItem key={airport.city} value={airport.code}>
                  {airport.city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-neutral-400 font-light">
            {paginatedAirports.find((airport) => airport.code === city.from)
              ?.name || "Select a city"}
          </p>
          <button
            className="w-10 h-10 flex items-center justify-center border shadow-md rounded-full absolute top-12 -right-5 z-10 cursor-pointer bg-white"
            onClick={() => handleCitySwap(city.id)}
          >
            <ArrowRightLeft size={14} />
          </button>
        </div>
        <div className="border p-6 hover:bg-yellow/10 transition-all duration-300 cursor-pointer">
          <p className="text-xs sm:text-sm text-neutral-400">To</p>
          <Select
            value={city.to}
            onValueChange={(value) => handleCityChange(city.id, "to", value)}
          >
            <SelectTrigger className="w-full sm:w-[280px]">
              <SelectValue placeholder="Select a city" />
            </SelectTrigger>
            <SelectContent>
              {paginatedAirports.map((airport) => (
                <SelectItem key={airport.city} value={airport.code}>
                  {airport.city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-neutral-400 font-light">
            {paginatedAirports.find((airport) => airport.code === city.to)
              ?.name || "Select a city"}
          </p>
        </div>
        <div className="border p-6 hover:bg-yellow/10 transition-all duration-300 cursor-pointer">
          <p className="text-xs sm:text-sm text-neutral-400">Departure</p>
          <Select onValueChange={(value) => setDepartureDate(value)}>
            <SelectTrigger className="w-full sm:w-[280px]">
              <SelectValue placeholder="Select a date" />
            </SelectTrigger>
            <SelectContent>
              {realDates.map((date) => (
                <SelectItem key={date.id} value={date.date}>
                  <h3 className="text-lg sm:text-xl font-bold mt-3">
                    {date.date}{" "}
                    <span className="text-sm">
                      {format(new Date(), "MMM")}&apos;{date.day}
                    </span>
                  </h3>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-neutral-400 font-light"></p>
        </div>

        {index === cities.length - 1 && (
          <div
            className={`border p-6 hover:bg-yellow/10 transition-all duration-300 cursor-pointer flex items-center w-fit rounded-r-xl ${
              city.to ? "" : "bg-gray-100"
            }`}
          >
            {city.to ? (
              <button
                onClick={addCity}
                className="flex items-center gap-2 text-yellow"
              >
                <PlusCircle className="cursor-pointer bg-yellow text-white rounded-full" />
                <p className="text-xl font-semibold">Add City</p>
              </button>
            ) : (
              <button
                onClick={() => removeCity(city.id)}
                className="flex items-center gap-2 "
                disabled={cities.length <= 2}
              >
                <X className="cursor-pointer border-2 text-black rounded-full p-1 border-black" />
              </button>
            )}
          </div>
        )}
      </div>
    ));
  };

  const renderTripFields = () => {
    switch (selectedTripType) {
      case "One Way":
        return (
          <>
            <div className="border p-6 hover:bg-yellow/10 transition-all duration-300 cursor-pointer">
              <p className="text-xs sm:text-sm text-neutral-400">Departure</p>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="d MMM''yy"
                placeholderText="Select a date"
                className="w-[280px] px-2 py-1 bg-transparent focus:outline-none font-semibold text-2xl text-black"
                minDate={new Date()}
                formatWeekDay={(nameOfDay) => nameOfDay.substr(0, 3)}
                calendarClassName="bg-white shadow-xl rounded-xl border border-gray-200 w-full"
                dayClassName={(date) => {
                  const isSelected =
                    selectedDate instanceof Date &&
                    selectedDate.toDateString() === date.toDateString();
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                  return `${
                    isSelected ? "bg-yellow text-white font-semibold" : ""
                  } ${
                    isWeekend ? "text-blue-500 font-semibold" : "text-black"
                  }`;
                }}
                todayButton="Go to today"
              />
            </div>
            <div className="border p-6 hover:bg-yellow/10 transition-all duration-300 cursor-pointer">
              <p className="text-xs sm:text-sm text-neutral-400">Return</p>
              <p className="text-xs text-neutral-400 font-light">
                Not applicable
              </p>
            </div>
          </>
        );
      case "Round Trip":
        return (
          <>
            <div className="border p-6 hover:bg-yellow/10 transition-all duration-300 cursor-pointer">
              <p className="text-xs sm:text-sm text-neutral-400">Departure</p>
              <Select>
                <SelectTrigger className="w-full sm:w-[280px]">
                  <SelectValue placeholder="Select a date" />
                </SelectTrigger>
                <SelectContent>
                  {dates.map((airport) => (
                    <SelectItem key={airport.id} value={airport.day}>
                      <h3 className="text-lg sm:text-xl font-bold mt-3">
                        {airport.date}{" "}
                        <span className="text-sm">SEP&apos;{airport.day}</span>
                      </h3>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="border p-6 hover:bg-yellow/10 transition-all duration-300 cursor-pointer">
              <p className="text-xs sm:text-sm text-neutral-400">Return</p>
              <Select>
                <SelectTrigger className="w-full sm:w-[280px]">
                  <SelectValue placeholder="Select a date" />
                </SelectTrigger>
                <SelectContent>
                  {dates.map((airport) => (
                    <SelectItem key={airport.id} value={airport.day}>
                      <h3 className="text-lg sm:text-xl font-bold mt-3">
                        {airport.date}{" "}
                        <span className="text-sm">SEP&apos;{airport.day}</span>
                      </h3>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl relative ">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setSelectedTripType("One Way")}
          className={`text-xs flex items-center gap-2 rounded-full p-2 ${
            selectedTripType === "One Way" && "bg-yellow/10"
          }`}
        >
          <span
            className={`block w-4 h-4 rounded-full ${
              selectedTripType === "One Way" ? "bg-yellow" : "bg-white"
            }`}
          ></span>
          <p>One Way</p>
        </button>
        <button
          onClick={() => setSelectedTripType("Round Trip")}
          className={`text-xs flex items-center gap-2 rounded-full p-2 ${
            selectedTripType === "Round Trip" && "bg-yellow/10"
          }`}
        >
          <span
            className={`block w-4 h-4 rounded-full ${
              selectedTripType === "Round Trip" ? "bg-yellow" : "bg-white"
            }`}
          ></span>
          <p>Round Trip</p>
        </button>
        <button
          onClick={() => setSelectedTripType("Multiple City")}
          className={`text-xs flex items-center gap-2 rounded-full p-2 ${
            selectedTripType === "Multiple City" && "bg-yellow/10"
          }`}
        >
          <span
            className={`block w-4 h-4 rounded-full ${
              selectedTripType === "Multiple City" ? "bg-yellow" : "bg-white"
            }`}
          ></span>
          <p>Multiple City</p>
        </button>
      </div>

      {selectedTripType === "Multiple City" ? (
        renderCityCards()
      ) : (
        <div className="rounded-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 mb-6 relative">
          <CustomDropdown
            options={allCity}
            selectedValue={selectedCities[0].Origin || "AMD"}
            onValueChange={(value) => handleCityChangess("Origin", value)}
            fetchCityData={allCityData}
            placeholder="Select origin city"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isOrigin={true}
            onCountryChange={handleOriginCountryChange}
          />

          <CustomDropdown
            options={allCity}
            selectedValue={selectedCities[0].Destination || "BLR"}
            onValueChange={(value) => handleCityChangess("Destination", value)}
            fetchCityData={allCityData}
            placeholder="Select destination city"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isOrigin={true}
            onCountryChange={handleDestinationCountryChange}
          />

          {renderTripFields()}
          <div className="border p-6 rounded-r-xl hover:bg-yellow/10 transition-all duration-300 cursor-pointer">
            <p className="text-xs sm:text-sm text-neutral-400">
              Travelers & Class
            </p>
            <Select>
              <SelectTrigger className="w-full sm:w-[280px] mt-2">
                <SelectValue
                  placeholder={
                    <div className="flex flex-col items-start">
                      <span className="text-2xl font-semibold">
                        {travelerCounts.a + travelerCounts.c + travelerCounts.i}{" "}
                        Travelers
                      </span>
                      <span className="text-sm text-gray-500 font-medium">
                        {
                          [
                            "Economy",
                            "Premium Economy",
                            "Business",
                            "First Class",
                          ][travelerCounts.tp]
                        }
                      </span>
                    </div>
                  }
                />
              </SelectTrigger>
              <SelectContent className="bg-white p-4 shadow-lg rounded-md">
                {/* Adults Selector */}
                <div className="flex flex-col items-start mb-4">
                  <span className="text-sm">
                    ADULTS (12y +){" "}
                    <span className="text-sm text-gray-500">
                      on the day of travel
                    </span>
                  </span>

                  <div className="flex bg-gray-200 rounded-sm mt-2">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <button
                        key={`adult-${num}`}
                        className={`px-3 py-1 rounded-md ${
                          travelerCounts.a === num
                            ? "bg-yellow text-white"
                            : "bg-gray-200"
                        }`}
                        onClick={() => handleCountChange("a", num)}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Children Selector */}
                <div className="flex flex-col items-start mb-4">
                  <span className="text-sm">
                    CHILDREN (2y - 12y ){" "}
                    <span className="text-sm text-gray-500">
                      on the day of travel
                    </span>
                  </span>
                  <div className="flex bg-gray-200 rounded-sm mt-2">
                    {[0, 1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={`children-${num}`}
                        className={`px-3 py-1 rounded-md ${
                          travelerCounts.c === num
                            ? "bg-yellow text-white"
                            : "bg-gray-200"
                        }`}
                        onClick={() => handleCountChange("c", num)}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Infants Selector */}
                <div className="flex flex-col items-start">
                  <span className="text-sm">
                    INFANTS (below 2y){" "}
                    <span className="text-sm text-gray-500">
                      on the day of travel
                    </span>
                  </span>

                  <div className="flex bg-gray-200 rounded-sm mt-2">
                    {[0, 1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={`infant-${num}`}
                        className={`px-3 py-1 rounded-md ${
                          travelerCounts.i === num
                            ? "bg-yellow text-white"
                            : "bg-gray-200"
                        }`}
                        onClick={() => handleCountChange("i", num)}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Class Selector */}
                <div className=" mt-2">
                  <span className="text-sm">Travel Type</span>
                  <div className="flex bg-gray-200 rounded-sm">
                    {[
                      "Economy",
                      "Premium Economy",
                      "Business",
                      "First Class",
                    ].map((type, index) => (
                      <button
                        key={`travelType-${index}`}
                        className={`px-3 py-1 rounded-md ${
                          travelerCounts.tp === index
                            ? "bg-yellow text-white"
                            : "bg-gray-200"
                        }`}
                        onClick={() => handleCountChange("tp", index)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center md:gap-4">
        <button
          className={`p-4 rounded-xl flex items-center gap-2 border-2 cursor-pointer ${
            selectedFareType === "Regular"
              ? "border-2 border-yellow"
              : "border-neutral-300"
          }`}
          onClick={() => setSelectedFareType("Regular")}
        >
          <Checkbox checked={selectedFareType === "Regular"} />
          <div className="flex flex-col items-start">
            <p className="text-md font-semibold">Regular</p>
            <p className="text-xs sm:text-sm text-neutral-400">Regular fares</p>
          </div>
        </button>
        <button
          className={`p-4 rounded-xl flex items-center gap-2 border-2 cursor-pointer ${
            selectedFareType === "Senior Citizen"
              ? "border-2 border-yellow"
              : "border-neutral-300"
          }`}
          onClick={() => setSelectedFareType("Senior Citizen")}
        >
          <Checkbox checked={selectedFareType === "Senior Citizen"} />
          <div className="flex flex-col items-start">
            <p className="text-md font-semibold">Senior Citizen</p>
            <p className="text-xs sm:text-sm text-neutral-400">upto $560 off</p>
          </div>
        </button>
        <button
          className={`p-4 rounded-xl flex items-center gap-2 border-2 cursor-pointer ${
            selectedFareType === "Armed Forces"
              ? "border-2 border-yellow"
              : "border-neutral-300"
          }`}
          onClick={() => setSelectedFareType("Armed Forces")}
        >
          <Checkbox checked={selectedFareType === "Armed Forces"} />
          <div className="flex flex-col items-start">
            <p className="text-md font-semibold">Armed Forces</p>
            <p className="text-xs sm:text-sm text-neutral-400">upto $560 off</p>
          </div>
        </button>
        <button
          className={`p-4 rounded-xl flex items-center gap-2 border-2 cursor-pointer ${
            selectedFareType === "Doctor and Nurses"
              ? "border-2 border-yellow"
              : "border-neutral-300"
          }`}
          onClick={() => setSelectedFareType("Doctor and Nurses")}
        >
          <Checkbox checked={selectedFareType === "Doctor and Nurses"} />
          <div className="flex flex-col items-start">
            <p className="text-md font-semibold">Doctor and Nurses</p>
            <p className="text-xs sm:text-sm text-neutral-400">upto $560 off</p>
          </div>
        </button>
      </div>

      <Button
        onClick={handleRedirect}
        size="lg"
        className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow text-white py-2 px-4 rounded-full hover:bg-yellow-600 transition-colors duration-300"
      >
        Search
      </Button>
    </div>
  );
}
