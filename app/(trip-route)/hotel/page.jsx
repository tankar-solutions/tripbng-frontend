"use client";
import Button from "@/components/ui/button";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { airports } from "@/constants/data/airports";
import { dates } from "@/constants/data/date";
import { PRICE_RANGE, ROOMS_GUEST } from "@/constants/data/hotel-data";
import { useRouter } from "next/navigation";

export default function Hotel() {
  const router = useRouter();

  // State to manage the selected values
  const [selectedCity, setSelectedCity] = useState("AAA"); // Set default to "AAA"
  const [checkInDate, setCheckInDate] = useState(dates[0]?.day);
  const [checkOutDate, setCheckOutDate] = useState(dates[1]?.day); // Default to the next date
  const [roomAndGuests, setRoomAndGuests] = useState(ROOMS_GUEST[0]?.name);
  const [priceRange, setPriceRange] = useState(PRICE_RANGE[0]?.name);

  const handleSearch = () => {
    // Construct the URL dynamically based on selected values
    const searchUrl = `/hotel-search/${selectedCity}-${checkInDate}-${checkOutDate}-${roomAndGuests}-${priceRange}`;
    router.push(searchUrl);
  };

  return (
    <div className="bg-white p-8 rounded-xl relative">
      <div className="rounded-xl grid grid-cols-5 mb-6">
        {/* City Selector */}
        <div className="border p-6 rounded-l-xl">
          <p className="text-xs text-neutral-400">
            City, Property name or Location
          </p>
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a city" />
            </SelectTrigger>
            <SelectContent>
              {airports.map((airport) => (
                <SelectItem key={airport.code} value={airport.code}>
                  {airport.city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Check-In Selector */}
        <div className="border p-6 hover:bg-yellow/10 transition-all duration-300 cursor-pointer">
          <p className="text-xs text-neutral-400">Check-In</p>
          <Select value={checkInDate} onValueChange={setCheckInDate}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a date" />
            </SelectTrigger>
            <SelectContent>
              {dates.map((date) => (
                <SelectItem key={date.id} value={date.day}>
                  <h3 className="text-xl font-bold mt-3">
                    {date.date} <span className="text-sm">SEP&apos;{date.day}</span>
                  </h3>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Check-Out Selector */}
        <div className="border p-6 hover:bg-yellow/10 transition-all duration-300 cursor-pointer">
          <p className="text-xs text-neutral-400">Check-Out</p>
          <Select value={checkOutDate} onValueChange={setCheckOutDate}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a date" />
            </SelectTrigger>
            <SelectContent>
              {dates.map((date) => (
                <SelectItem key={date.id} value={date.day}>
                  <h3 className="text-xl font-bold mt-3">
                    {date.date} <span className="text-sm">SEP&apos;{date.day}</span>
                  </h3>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Rooms & Guests Selector */}
        <div className="border p-6 hover:bg-yellow/10 transition-all duration-300 cursor-pointer">
          <p className="text-xs text-neutral-400">Rooms & Guests</p>
          <Select value={roomAndGuests} onValueChange={setRoomAndGuests}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select rooms & guests" />
            </SelectTrigger>
            <SelectContent>
              {ROOMS_GUEST.map((option) => (
                <SelectItem key={option.id} value={option.name}>
                  <h3 className="text-xl font-bold mt-3">
                    <span className="text-sm">{option.name}</span>
                  </h3>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-xs text-neutral-400 font-light">
            Economy / Premium Economy
          </span>
        </div>

        {/* Price Range Selector */}
        <div className="border p-6 rounded-r-xl hover:bg-yellow/10 transition-all duration-300 cursor-pointer">
          <p className="text-xs text-neutral-400">Price range per night</p>
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select price range" />
            </SelectTrigger>
            <SelectContent>
              {PRICE_RANGE.map((option) => (
                <SelectItem key={option.id} value={option.name}>
                  <h3 className="text-xl font-bold mt-3">
                    <span className="text-sm">{option.name}</span>
                  </h3>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-xs text-neutral-400 font-light">
            Economy / Premium Economy
          </span>
        </div>
      </div>

      {/* Search Button */}
      <Button
        onClick={handleSearch}
        size="lg"
        className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow text-white py-2 px-4 rounded-full hover:bg-yellow-600 transition-colors duration-300"
      >
        Search
      </Button>
    </div>
  );
}