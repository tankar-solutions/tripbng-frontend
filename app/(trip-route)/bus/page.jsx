"use client";

import Button from "@/components/ui/button";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { format } from "date-fns";
import DatePicker from "react-datepicker";

export default function Bus() {
  const router = useRouter();
  const [cities, setCities] = useState([]);

  const [fromCity, setFromCity] = useState(null);
  const [fromCityOpen, setFromCityOpen] = useState(false);
  const [fromCityOptions, setFromCityOptions] = useState([]);
  const [fromCitySearchQuery, setFromCitySearchQuery] = useState("");
  const fromCityInputRef = useRef(null);
  const fromCityDropdownRef = useRef(null);

  const [toCity, setToCity] = useState(null);
  const [toCityOpen, setToCityOpen] = useState(false);
  const [toCityOptions, setToCityOptions] = useState([]);
  const [toCitySearchQuery, setToCitySearchQuery] = useState("");
  const toCityInputRef = useRef(null);
  const toCityDropdownRef = useRef(null);

  const [fromCityId, setFromCityId] = useState(null);
  const [toCityId, setToCityId] = useState(null);
  const [fromCityName, setFromCityName] = useState(null);
  const [toCityName, setToCityName] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(
          "https://api-tripbng.onrender.com/bus/getcitylist"
        );

        if (response.data.data.success) {
          const cityData = response.data.data.data.CityDetails || [];
          setCities(cityData);
          setFromCityOptions(cityData);
          setToCityOptions(cityData);

          const defaultFromCity = cityData.find((city) =>
            city.CityName.toLowerCase().includes("ahmedabad")
          );
          const defaultToCity = cityData.find((city) =>
            city.CityName.toLowerCase().includes("mumbai")
          );

          if (defaultFromCity) {
            setFromCity(defaultFromCity);
            setFromCityId(defaultFromCity.CityID);
            setFromCityName(defaultFromCity.CityName);
          }
          if (defaultToCity) {
            setToCity(defaultToCity);
            setToCityId(defaultToCity.CityID);
            setToCityName(defaultToCity.CityName);
          }
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, []);

  const handleSelect = (option, setDropdown, setDropdownOpen, setId) => {
    setDropdown(option);
    setDropdownOpen(false);
    setId(option?.CityID || null);
  };

  const toggleDropdown = (setDropdownOpen, setOtherDropdownOpen) => {
    setDropdownOpen((prev) => !prev);
    if (setOtherDropdownOpen) {
      setOtherDropdownOpen(false);
    }
  };

  const handleSearchChange = (e, setSearchQuery) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const Dropdown = ({
    options,
    selected,
    onSelect,
    isOpen,
    toggleOpen,
    searchQuery,
    onSearchChange,
    inputRef,
    dropdownRef,
    placeholder,
    setDropdownOpen,
  }) => {
    useEffect(() => {
      function handleClickOutside(event) {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setDropdownOpen(false);
        }
      }

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen, setDropdownOpen]);

    useEffect(() => {
      if (isOpen && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isOpen]);

    const filteredOptions = useMemo(() => {
      return options.filter((option) => {
        const name = option?.CityName?.toLowerCase() || "";
        return name.includes(searchQuery.toLowerCase());
      });
    }, [options, searchQuery]);

    return (
      <div className="relative w-64" ref={dropdownRef}>
        <button className="w-full py-2 text-left text-2xl" onClick={toggleOpen}>
          {selected ? (
            <strong>{selected.CityName}</strong>
          ) : (
            placeholder || "Select an option"
          )}
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-md mt-2">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={onSearchChange}
              className="w-full px-4 py-2 border-b border-gray-300 rounded-t-lg focus:outline-none"
              placeholder="Search..."
            />
            <ul className="max-h-60 overflow-y-auto">
              {filteredOptions.map((option, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => onSelect(option)}
                >
                  <strong>{option.CityName}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const handleSearchClick = () => {
    if (!fromCityId || !toCityId || !fromCity || !toCity || !selectedDate) {
      alert("Please select valid cities and date!");
      return;
    }

    const formattedDate = format(selectedDate, "dd-MM-yyyy");

    const searchUrl = `/bus-search/${fromCity.CityName}/${toCity.CityName}/${formattedDate}?from_code=${fromCityId}&to_code=${toCityId}`;

    router.push(searchUrl);
  };

  const day = format(selectedDate, "d");
  const month = format(selectedDate, "MMM");
  const year = format(selectedDate, "yy");
  const weekday = format(selectedDate, "EEEE");

  return (
    <div className="bg-white p-8 rounded-xl relative">
      <div className="rounded-xl grid grid-cols-3 mb-6 mt-6">
        <div className="border p-3 rounded-l-xl hover:bg-yellow/10 transition-all duration-300 cursor-pointer">
          <p className="text-xs text-neutral-400">From</p>
          <Dropdown
            options={fromCityOptions}
            selected={fromCity}
            onSelect={(option) =>
              handleSelect(option, setFromCity, setFromCityOpen, setFromCityId)
            }
            isOpen={fromCityOpen}
            toggleOpen={() => toggleDropdown(setFromCityOpen, setToCityOpen)}
            searchQuery={fromCitySearchQuery}
            onSearchChange={(e) =>
              handleSearchChange(e, setFromCitySearchQuery)
            }
            inputRef={fromCityInputRef}
            dropdownRef={fromCityDropdownRef}
            placeholder="From City"
            setDropdownOpen={setFromCityOpen}
          />
          <p className="text-gray">India</p>
        </div>
        <div className="border p-3 hover:bg-yellow/10 transition-all duration-300 cursor-pointer">
          <p className="text-xs text-neutral-400">To</p>
          <Dropdown
            options={toCityOptions}
            selected={toCity}
            onSelect={(option) =>
              handleSelect(option, setToCity, setToCityOpen, setToCityId)
            }
            isOpen={toCityOpen}
            toggleOpen={() => toggleDropdown(setToCityOpen, setFromCityOpen)}
            searchQuery={toCitySearchQuery}
            onSearchChange={(e) => handleSearchChange(e, setToCitySearchQuery)}
            inputRef={toCityInputRef}
            dropdownRef={toCityDropdownRef}
            placeholder="To City"
            setDropdownOpen={setToCityOpen}
          />
          <p className="text-gray">India</p>
        </div>
        <div className="border p-3 rounded-r-xl hover:bg-yellow/10 transition-all duration-300">
          <p className="text-lg font-medium text-neutral-400">Travel Date</p>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
            customInput={
              <div className="mt-2">
                <span className="text-2xl font-bold">{day}</span>
                <span className="text-xl font-semibold">
                  {" "}
                  {month}'{year}
                </span>
                <p className="text-lg text-gray-700">{weekday}</p>
              </div>
            }
          />
        </div>
      </div>
      <Button
        onClick={handleSearchClick}
        className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow text-white text-xl font-semibold py-2 px-14 rounded-full hover:bg-yellow-600 transition-colors duration-300"
      >
        Search Buses
      </Button>
    </div>
  );
}
