"use client";
import Button from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dates } from "@/constants/data/date";
import { PRICE_RANGE, ROOMS_GUEST } from "@/constants/data/hotel-data";
import { useRouter } from "next/navigation";
import axios from "axios";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";
import { ChevronDown, Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const { RangePicker } = DatePicker;

export default function Hotel() {
  const router = useRouter();
  const [checkInDate, setCheckInDate] = useState(dates[0]?.day);
  const [checkOutDate, setCheckOutDate] = useState(dates[1]?.day);
  const [roomAndGuests, setRoomAndGuests] = useState(ROOMS_GUEST[0]?.name);
  const [priceRange, setPriceRange] = useState(PRICE_RANGE[0]?.name);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Select a city");
  const [locationData, setLocationData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [rooms, setRooms] = useState([
    { adults: 1, children: 0, childAges: [] },
  ]);
  const [open, setOpen] = useState(false);
  const [checkIn, setCheckIn] = useState(dayjs().format("YYYY-MM-DD"));
  const [checkOut, setCheckOut] = useState(
    dayjs().add(1, "day").format("YYYY-MM-DD")
  );

  
console.log(selectedLocation);

  // Select pax details
  const toggleDropdownPax = () => setOpen(!open);

  const handleAddRoom = () => {
    setRooms([...rooms, { adults: 1, children: 0, childAges: [] }]);
  };

  const handleRemoveRoom = (index) => {
    const updatedRooms = rooms.filter((_, i) => i !== index);
    setRooms(updatedRooms);
  };
  const handleAdultChange = (index, value) => {
    const updatedRooms = [...rooms];
    const newValue = Math.min(8, Math.max(1, value)); // Maximum 8 adults
    updatedRooms[index].adults = newValue;
    setRooms(updatedRooms);
  };

  const handleChildrenChange = (index, value) => {
    const updatedRooms = [...rooms];
    const newValue = Math.min(4, Math.max(0, value)); // Maximum 4 children
    updatedRooms[index].children = newValue;
    updatedRooms[index].childAges = updatedRooms[index].childAges.slice(
      0,
      newValue
    );
    while (updatedRooms[index].childAges.length < newValue) {
      updatedRooms[index].childAges.push("1");
    }
    setRooms(updatedRooms);
  };

  const handleChildAgeChange = (roomIndex, ageIndex, value) => {
    const updatedRooms = [...rooms];
    updatedRooms[roomIndex].childAges[ageIndex] = value;
    setRooms(updatedRooms);
  };

  const handleDone = () => {
    console.log("Selected Rooms:", rooms);
    setOpen(false);
  };

  const dropdownRef = useRef(null);

  const toggleDropdown = async () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      await getAutoSuggestLocation();
    }
  };

  const selectLocation = (location) => {
    setSelectedLocation(location);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getAutoSuggestLocation = async (term = "") => {
    try {
      const response = await axios.get(
        `https://autosuggest.travel.zentrumhub.com/api/locations/locationcontent/autosuggest?term=${term}`
      );

      if (response.status === 200) {
        const suggestions = response?.data?.locationSuggestions || [];
        setLocationData(suggestions);
      } else {
        console.log("Failed to fetch locations:", response.status);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    getAutoSuggestLocation(term);
  };

  const handleRedirect = async () => {
    if (!selectedLocation) {
      toast.error("Please select a location first.");
      return;
    }

    const payload = {
      channelId: "client-demo-channel",
      currency: "USD",
      culture: "en-US",
      checkIn,
      checkOut,
      occupancies: rooms.map((room) => ({
        numOfAdults: room.adults,
        childAges: room.childAges.map(Number),
      })),
      circularRegion: {
        centerLat: selectedLocation.coordinates.lat,
        centerLong: selectedLocation.coordinates.long,
        radiusInKm: 30,
      },
      searchLocationDetails: {
        id: selectedLocation.id,
        name: selectedLocation.name,
        fullName: selectedLocation.fullName,
        type: selectedLocation.type,
        state: selectedLocation.state,
        country: selectedLocation.country,
        coordinates: selectedLocation.coordinates,
      },
      nationality: "IN",
      countryOfResidence: "IN",
      destinationCountryCode: "IN",
      travelPurpose: "Leisure",
      filterBy: null,
    };

    try {
      const response = await axios.post(
        "https://nexus.prod.zentrumhub.com/api/hotel/availability/init",
        payload,
        {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Accept-Encoding": "gzip, deflate",
            accountId: "zentrum-demo-account",
            "customer-ip": "54.86.50.139",
            correlationId: "5e860c0f-a6a6-1d48-c74e-71f580463d73",
            apiKey: "demo123",
          },
        }
      );

      if (response.status === 202) {
        const token = response.data.token;
        const searchUrl = `/hotel-search/${token}?${selectedLocation.name}/${checkIn}/${checkOut}/${rooms.length}`;
        router.push(searchUrl);
      } else {
        console.log("Failed to fetch availability:", response.status);
      }
    } catch (error) {
      console.error("Error during hotel availability search:", error);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl relative">
      <div className="rounded-xl grid grid-cols-3 mb-6">
        <div className="border p-6 rounded-l-xl hover:bg-yellow/10">
          <p className="text-xs text-neutral-400 font-semibold">
            City, Property name or Location
          </p>
          <div className="relative w-full bg-transparent" ref={dropdownRef}>
            <button
              className="w-full p-3 rounded-lg text-2xl text-left font-semibold"
              onClick={toggleDropdown}
            >
              {selectedLocation?.name || "Select a city"}
            </button>
            {isOpen && (
              <div className="absolute top-full left-0 w-full bg-white border mt-1 max-h-60 overflow-y-auto">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search location..."
                  className="w-full p-2 border-b"
                />
                {locationData.map((location) => (
                  <div
                    key={location.id}
                    className="p-2 hover:bg-blue-100 cursor-pointer"
                    onClick={() => selectLocation(location)}
                  >
                    {location.fullName}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border p-6 hover:bg-yellow-100/10 transition-all duration-300 cursor-pointer">
          <p className="text-xs font-semibold text-neutral-400">
            Check-In & Check-Out
          </p>
          <RangePicker
            format="DD MMM YYYY"
            defaultValue={[dayjs(), dayjs().add(1, "day")]}
            onChange={(dates) => {
              if (dates) {
                setCheckIn(dates[0].format("YYYY-MM-DD"));
                setCheckOut(dates[1].format("YYYY-MM-DD"));
              }
            }}
            className="w-full border-none rounded-lg text-2xl font-semibold custom-range-picker mt-2"
          />
        </div>

        <div className="relative border p-6 hover:bg-yellow/10 transition-all duration-300 cursor-pointer rounded-r-xl">
          <div className=" " onClick={toggleDropdownPax}>
            <p className="text-xs font-semibold text-neutral-400">
              Rooms & Guests
            </p>
            <div className="flex items-center mt-3">
              <p className=" text-2xl font-semibold">
                {rooms.reduce(
                  (acc, room) => acc + room.adults + room.children,
                  0
                )}{" "}
                Guests, {rooms.length} Room(s)
              </p>
              <ChevronDown className="ml-2 w-4 h-4" />
            </div>
          </div>

          {open && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-12 left-0 w-80 bg-white border shadow-xl rounded-xl mt-2 p-4 z-50"
            >
              {rooms.map((room, roomIndex) => (
                <div
                  key={roomIndex}
                  className="mb-4 border-b pb-4 last:border-none"
                >
                  <h3 className="font-semibold mb-3 text-lg">
                    Room {roomIndex + 1}
                  </h3>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium">Adults</p>
                      <p className="text-xs text-neutral-400">
                        Age 18 and above
                      </p>
                    </div>
                    <input
                      type="number"
                      min="1"
                      value={room.adults}
                      onChange={(e) =>
                        handleAdultChange(roomIndex, parseInt(e.target.value))
                      }
                      className="w-16 border rounded px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium">Children</p>
                      <p className="text-xs text-neutral-400">
                        Age 17 and below
                      </p>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={room.children}
                      onChange={(e) =>
                        handleChildrenChange(
                          roomIndex,
                          parseInt(e.target.value)
                        )
                      }
                      className="w-16 border rounded px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  {room.children > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">
                        Children's Ages
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {room.childAges.map((age, ageIndex) => (
                          <input
                            key={ageIndex}
                            type="number"
                            min="1"
                            max="17"
                            value={age}
                            onChange={(e) =>
                              handleChildAgeChange(
                                roomIndex,
                                ageIndex,
                                e.target.value
                              )
                            }
                            className="w-12 border rounded px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-green-400"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex justify-end">
                    {rooms.length > 1 && (
                      <button
                        onClick={() => handleRemoveRoom(roomIndex)}
                        className="text-red-500 text-sm flex items-center hover:text-red-700 transition-colors"
                      >
                        <Minus className="w-4 h-4 mr-1" /> Remove Room
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button
                onClick={handleAddRoom}
                className="w-full py-2 border rounded-xl text-blue-600 hover:bg-blue-50 flex items-center justify-center mb-3 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Room
              </button>

              <button
                onClick={handleDone}
                className="w-full py-2 bg-yellow text-white text-lg font-semibold rounded-xl hover:bg-yellow/50  transition-all"
              >
                Done
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <Button
        onClick={handleRedirect}
        size="lg"
        className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow text-white text-lg font-semibold py-2 px-10 rounded-full hover:bg-yellow-600 transition-colors duration-300"
      >
        SEARCH
      </Button>
    </div>
  );
}
