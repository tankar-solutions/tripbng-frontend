"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dates } from "@/constants/data/date";
import { VISA_TYPE } from "@/constants/data/visa-data";
import { useRouter } from "next/navigation";
import { apiService } from "@/lib/api";
import DatePicker from "react-datepicker";

export default function Bus() {
  const router = useRouter();
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCountry, setSelectedCountry] = useState("United States");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stayingDays, setStayingDays] = useState(20);
  const [visaType, setVisaType] = useState("Visa Gold");
  const [paxState, setPaxState] = useState({
    adult: 1,
    child: 0,
    infant: 0,
  });

  const handleStayingDaysChange = (value) => {
    setStayingDays(value);
  };

  const handleVisaTypeChange = (value) => {
    setVisaType(value);
  };
  
  const handleIncrement = (type) => {
    setPaxState((prevState) => ({
      ...prevState,
      [type]: prevState[type] + 1,
    }));
  };

  const handleDecrement = (type) => {
    setPaxState((prevState) => ({
      ...prevState,
      [type]: prevState[type] > 0 ? prevState[type] - 1 : 0,
    }));
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const getAllCountries = async () => {
    try {
      const response = await apiService.get("/user/countries/all");
      if (response.success) {
        setCountries(response.data);
        setFilteredCountries(response.data);
      }
    } catch (err) {
      console.error("Error fetching countries:", err);
    }
  };

  useEffect(() => {
    getAllCountries();
  }, []);
  const handleKeyDown = (e) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
    }
  };

  const handleSearch = () => {
    const token = localStorage.getItem("token"); 

    if (token) {
    
    const queryParams = new URLSearchParams({
      country: selectedCountry,
      date: selectedDate.toISOString(),
      visaType: visaType,
      stayingDays: stayingDays,
      adult: paxState.adult,
      child: paxState.child,
      infant: paxState.infant,
    }).toString();

    router.push(`/visa-search?${queryParams}`);
  }
    else {
      router.push('/login')
    }
  };
  
  return (
    <div className="bg-white p-8 rounded-xl relative">
      <div className="rounded-xl grid grid-cols-5 mb-6 mt-6">
        <div className="border p-6 rounded-l-xl hover:bg-yellow/10 transition-all duration-300 cursor-pointer">
          <p className="text-xs text-neutral-400">For</p>
          <Select
            value={selectedCountry} // Set selected value here
            onValueChange={(value) => setSelectedCountry(value)} // Update selected country
          >
            <SelectTrigger className="w-[280px] font-semibold text-xl">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              {filteredCountries.map((country) => (
                <SelectItem key={country._id} value={country.name}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="border p-6 hover:bg-yellow/10 transition-all duration-300 cursor-pointer">
          <p className="text-xs text-neutral-400">Travel Date</p>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="w-[280px] px-2 py-1 bg-transparent focus:outline-none font-semibold text-xl text-black"
            dateFormat="MMM dd, yyyy"
            placeholderText="Select a date"
            onKeyDown={handleKeyDown} // Prevent keypress actions like Backspace
            onClick={(e) => e.preventDefault()} // Prevent manual typing
            showPopperArrow={false} // Remove input cursor
            popperPlacement="bottom" // Position calendar pop-up
          />
        </div>

        <div className="border p-6 hover:bg-yellow/10 transition-all duration-300 cursor-pointer">
          <p className="text-xs text-neutral-400">Visa type</p>
          <Select value={visaType} onValueChange={handleVisaTypeChange}>
            <SelectTrigger className="w-[280px] font-semibold text-xl">
              <SelectValue placeholder="Select a visa type" />
            </SelectTrigger>
            <SelectContent>
              {VISA_TYPE.map((visa) => (
                <SelectItem key={visa.label} value={visa.label}>
                  {visa.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="border p-6 hover:bg-yellow/10 transition-all duration-300 cursor-pointer">
          <p className="text-xs text-neutral-400">Staying Days</p>
          <Select value={stayingDays} onValueChange={handleStayingDaysChange}>
            <SelectTrigger className="w-[280px] font-semibold text-xl">
              <SelectValue placeholder="Select staying days" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 20 }, (_, i) => i + 1).map((day) => (
                <SelectItem key={day} value={day}>
                  {day} days
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div
          className="border p-6 rounded-r-xl hover:bg-yellow/10 transition-all duration-300 cursor-pointer"
          onClick={() => openModal()}
        >
          <p className="text-xs text-neutral-400">Travellers</p>
          <p className="font-semibold text-xl mt-2">{`${paxState.adult} Adults ${paxState.child} Child ${paxState.infant} Infant`}</p>
        </div>
      </div>
      <Button
        onClick={handleSearch}
        className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow text-white py-2 px-4 rounded-full hover:bg-yellow-600 transition-colors duration-300"
      >
        Search
      </Button>
      
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 flex items-center justify-center shadow-lg mb-5">
              <h1 className="text-xl font-semibold">PAX</h1>
            </div>
            <div>
              {/* Adult Section */}
              <div className="flex items-center justify-between gap-10 px-3">
                <span className="flex flex-col">
                  <p className="text-lg font-semibold">Adult</p>
                  <p className="text-gray-500">12 Years and Older</p>
                </span>
                <span className="flex items-center gap-2">
                  <button
                    className="text-xl font-semibold border-2 border-yellow rounded-lg w-10 h-10 flex items-center justify-center"
                    onClick={() => handleIncrement('adult')}
                  >
                    +
                  </button>
                  <p>{paxState.adult}</p>
                  <button
                    className="text-xl font-semibold border-2 border-yellow rounded-lg w-10 h-10 flex items-center justify-center"
                    onClick={() => handleDecrement('adult')}
                  >
                    -
                  </button>
                </span>
              </div>
              {/* Child Section */}
              <div className="flex items-center justify-between gap-10 px-3">
                <span className="flex flex-col">
                  <p className="text-lg font-semibold">Child</p>
                  <p className="text-gray-500">2 Years to Under 12 Years</p>
                </span>
                <span className="flex items-center gap-2">
                  <button
                    className="text-xl font-semibold border-2 border-yellow rounded-lg w-10 h-10 flex items-center justify-center"
                    onClick={() => handleIncrement('child')}
                  >
                    +
                  </button>
                  <p>{paxState.child}</p>
                  <button
                    className="text-xl font-semibold border-2 border-yellow rounded-lg w-10 h-10 flex items-center justify-center"
                    onClick={() => handleDecrement('child')}
                  >
                    -
                  </button>
                </span>
              </div>
              {/* Infant Section */}
              <div className="flex items-center justify-between gap-10 px-3">
                <span className="flex flex-col">
                  <p className="text-lg font-semibold">Infant</p>
                  <p className="text-gray-500">Under 2 Years</p>
                </span>
                <span className="flex items-center gap-2">
                  <button
                    className="text-xl font-semibold border-2 border-yellow rounded-lg w-10 h-10 flex items-center justify-center"
                    onClick={() => handleIncrement('infant')}
                  >
                    +
                  </button>
                  <p>{paxState.infant}</p>
                  <button
                    className="text-xl font-semibold border-2 border-yellow rounded-lg w-10 h-10 flex items-center justify-center"
                    onClick={() => handleDecrement('infant')}
                  >
                    -
                  </button>
                </span>
              </div>
            </div>
            {/* Close Buttons */}
            <div className="px-5 py-3 flex items-center gap-2">
              <button
                className="font-semibold text-yellow border border-yellow rounded-lg w-full py-2"
                onClick={closeModal}
              >
                CLOSE
              </button>
              <button
                className="font-semibold text-white bg-yellow rounded-lg w-full py-2"
                onClick={closeModal}
              >
                APPLY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
