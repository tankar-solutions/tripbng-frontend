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
import { useRouter } from "next/navigation";





export default function Holiday() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Search");

  const HolidayLinks = [
    { title: "Search" },
    { title: "Trending Packages" },
    { title: "Air India Express" },
    { title: "Honeymoon" },
    { title: "Luxe Holidays" },
    { title: "Party Packages" },
  ];

  const handleSearchClick = () => {
    router.push("/holiday-search");
  };

  return (
    <div className="bg-white rounded-xl relative">
      <div className="flex items-center gap-6 p-8 bg-yellow/10">
        {HolidayLinks.map((link, index) => (
          <button
            key={index}
            className={`py-2 px-4 text-sm font-light ${
              activeTab === link.title ? "border-b-2 border-yellow " : ""
            }`}
            onClick={() => setActiveTab(link.title)}
          >
            <h3 className="text-sm">{link.title}</h3>
          </button>
        ))}
      </div>

      <div className="rounded-xl grid grid-cols-5 mb-6 p-8">
        <div className="border p-6 rounded-l-xl hover:bg-yellow/10 transition-all duration-300 cursor-pointer">
          <p className="text-xs text-neutral-400">From</p>
          <Select>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a city" />
            </SelectTrigger>
            <SelectContent>
              {airports.map((airport) => (
                <SelectItem key={airport.city} value={airport.iataCode}>
                  {airport.city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-xs text-neutral-400 font-light">India</span>
        </div>
        <div className="border p-6 hover:bg-yellow/10 transition-all duration-300 cursor-pointer">
          <p className="text-xs text-neutral-400">To</p>
          <Select>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a city" />
            </SelectTrigger>
            <SelectContent>
              {airports.map((airport) => (
                <SelectItem key={airport.city} value={airport.iataCode}>
                  {airport.city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-xs text-neutral-400 font-light">India</span>
        </div>
        <div className="border p-6 hover:bg-yellow/10 transition-all duration-300 cursor-pointer">
          <p className="text-xs text-neutral-400">Departure Date</p>
          <Select>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a date" />
            </SelectTrigger>
            <SelectContent>
              {dates.map((airport) => (
                <SelectItem key={airport.id} value={airport.day}>
                  <h3 className="text-xl font-bold mt-3">
                    {airport.date}{" "}
                    <span className="text-sm">SEP&apos;{airport.day}</span>
                  </h3>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="border p-6 hover:bg-yellow/10 transition-all duration-300 cursor-pointer">
          <p className="text-xs text-neutral-400">Travel Date</p>
          <Select>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a date" />
            </SelectTrigger>
            <SelectContent>
              {dates.map((airport) => (
                <SelectItem key={airport.id} value={airport.day}>
                  <h3 className="text-xl font-bold mt-3">
                    {airport.date}{" "}
                    <span className="text-sm">SEP&apos;{airport.day}</span>
                  </h3>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button
      onClick={handleSearchClick}
       className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow text-white py-2 px-4 rounded-full hover:bg-yellow-600 transition-colors duration-300">
        Search Hotels
      </Button>
    </div>
  );
}
