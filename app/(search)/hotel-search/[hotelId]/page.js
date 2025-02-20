"use client";

import FilterModalHotel from "@/components/FilterModalHotel";
import Simmer from "@/components/layout/simmer";
import Button from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox";
import { HOTEL_LISTS } from "@/constants/data/hotel-data";
import { priceRanges } from "@/constants/data/priceRange";
import { propertyType } from "@/constants/data/propertyType";
import { ratingStar } from "@/constants/data/ratingStar";
import axios from "axios";
import { Filter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const params = useParams();
  const token = params.hotelId;
  const searchParams = useSearchParams();

  const [viewPriceSection, setViewPriceSection] = useState(false);
  const [isModalOpenFilter, setModalOpenFilter] = useState(false);
  const [hotelList, setHotelList] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [totalHotelFound, setTotalHotelFound] = useState(0);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    city: "",
    checkIn: "",
    checkOut: "",
    rooms: "",
  });
  useEffect(() => {
    if (searchParams) {
      const query = searchParams.keys().next().value;
      if (query) {
        const paramsArray = query.split("/");
        if (paramsArray.length >= 4) {
          const city = decodeURIComponent(paramsArray[0]);
          const checkInRaw = paramsArray[1];
          const checkOutRaw = paramsArray[2];
          const rooms = paramsArray[3];

          // Format dates to "Thu, 20 Feb 2025"
          const formattedCheckIn = formatDate(checkInRaw);
          const formattedCheckOut = formatDate(checkOutRaw);

          setDetails({
            city,
            checkIn: formattedCheckIn,
            checkOut: formattedCheckOut,
            rooms,
          });
        }
      }
    }
  }, [searchParams]);

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  // Load selected location from localStorage
  useEffect(() => {
    const savedLocation = localStorage.getItem("selectedLocation");
    if (savedLocation) {
      const parsedLocation = JSON.parse(savedLocation);
      setSelectedLocation(parsedLocation);
      console.log("Coordinates loaded:", parsedLocation.coordinates);
    } else {
      console.error("No location found in localStorage.");
    }
  }, []);

  // Fetch hotels when a location is selected
  useEffect(() => {
    if (selectedLocation) {
      getHotelList();
    }
  }, [selectedLocation]);

  // Fetch hotel list
  const getHotelList = async () => {
    setLoading(true);
    try {
      const availabilityList = await getHotelAvailability(token);
      if (!availabilityList.length) {
        console.error("No available hotels found.");
        setLoading(false);
        return;
      }

      const availableHotelIds = availabilityList.map((hotel) => hotel.id);
      const contentList = await getHotelContent(
        availableHotelIds,
        "client-demo-channel"
      );

      const mergedHotels = contentList.map((hotelContent) => {
        const availability = availabilityList.find(
          (hotel) => hotel.id === hotelContent.id
        );

        return {
          id: hotelContent.id,
          name: hotelContent.name || "Unknown Hotel",
          image:
            hotelContent.heroImage ||
            "https://via.placeholder.com/300x200?text=No+Image",
          location:
            hotelContent.contact?.address?.city?.name || "Unknown Location",
          rating: hotelContent.starRating || "N/A",
          distance: hotelContent.distance || "N/A",
          availability: availability?.availableRooms || "Unknown",
          rate: availability?.rate || null,
          rateLoading: true, // Track rate loading for each hotel
        };
      });

      setHotelList(mergedHotels);
    } catch (error) {
      console.error("Error fetching hotel list:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch hotel availability
  const getHotelAvailability = async (token) => {
    try {
      const response = await axios.get(
        `https://nexus.prod.zentrumhub.com/api/hotel/availability/async/${token}/results`,
        {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            accountId: "zentrum-demo-account",
            "customer-ip": "54.86.50.139",
            correlationId: "5e860c0f-a6a6-1d48-c74e-71f580463d73",
            apiKey: "bc46745f-8af7-473a-aeba-c6ce4efa18e5",
          },
        }
      );

      if (response.status === 200) {
        setTotalHotelFound(response?.data?.completedHotelCount);
        return response?.data?.hotels || [];
      }
      console.error("Failed to fetch availability:", response.status);
      return [];
    } catch (error) {
      console.error("Error fetching hotel availability:", error);
      return [];
    }
  };

  // Fetch hotel content
  const getHotelContent = async (hotelIds, channelId) => {
    try {
      const response = await axios.post(
        "https://nexus.prod.zentrumhub.com/api/content/hotelcontent/getHotelContent",
        {
          channelId,
          hotelIds,
          culture: "en-US",
          contentFields: ["Basic"],
        },
        {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "customer-ip": "54.86.50.139",
            correlationId: "58497bbd-8c3c-72e3-c981-46825d71b261",
            accountId: "zentrum-demo-account",
            apiKey: "bc46745f-8af7-473a-aeba-c6ce4efa18e5",
          },
        }
      );

      if (response.status === 200) {
        return response?.data?.hotels || [];
      }
      console.error("Failed to fetch hotel content:", response.status);
      return [];
    } catch (error) {
      console.error("Error fetching hotel content:", error);
      return [];
    }
  };

  // Handle rate load completion
  const handleRateLoadComplete = (hotelId) => {
    setHotelList((prevHotels) =>
      prevHotels.map((hotel) =>
        hotel.id === hotelId ? { ...hotel, rateLoading: false } : hotel
      )
    );
  };

  return (
    <div className="md:container   flex flex-col gap-4">
      <div className="bg-yellow flex items-center justify-between md:hidden py-4 px-3 md:px-10 shadow-lg">
        <span className="flex items-center gap-3">
          <button>
            <Image
              src="/icons/arrow.png"
              className="w-4 h-4 md:h-6 md:w-6"
              width={100}
              height={100}
              alt="Hotel img"
            />
          </button>

          <p className="text-white font-semibold text-lg">Ahmedabad, Gujrat</p>
        </span>

        <button>
          <Image
            src="/icons/filter.png"
            width={100}
            height={100}
            className="w-6 h-6"
            alt="Hotel img"
          />
        </button>
      </div>
      <FilterModalHotel
        isOpen={isModalOpenFilter}
        // onClose={handleModalToggle}
      />
      <div className=" grid-cols-5 py-10 bg-white rounded-xl hidden md:grid w-full ">
        <div className="border rounded-l-xl p-4">
          <p className="text-sm">CITY, AREA or PROPERTY</p>
          <p className="text-md font-semibold">{details.city}</p>
        </div>
        <div className="border p-4">
          <p className="text-sm">Check-In</p>
          <p className="text-md font-semibold">{details.checkIn}</p>
        </div>
        <div className="border p-4">
          <p className="text-sm">Check-Out </p>
          <p className="text-md font-semibold">{details.checkOut}</p>
        </div>
        <div className="border p-4">
          <p className="text-sm">Rooms & Guests</p>
          <p className="text-md font-semibold">{details.rooms} Room(s)</p>
        </div>
        <div className="border p-4 rounded-r-xl flex items-center">
          <Button
            onClick={() => {
              router.back();
            }}
          >
            Modify
          </Button>
        </div>
      </div>

      {/* Filters and Results */}
      <div className="flex gap-4 py-4 px-3 md:px-3">
        {/* Filters Section */}
        <div className="bg-white rounded-xl px-2 py-3 w-1/5 hidden md:block ">
          <span className="border flex rounded-lg w-full p-2 mb-3">
            <p className="text-sm font-medium">
              Total {totalHotelFound} hotels found
            </p>
          </span>

          <span className="border flex flex-col rounded-lg w-full mb-3">
            <h3 className="text-sm font-medium p-2">Sort By</h3>
            <span className="flex items-center justify-between border-b-2  border-dashed"></span>
            <span className="mt-3">
              <span className="flex items-center px-2 py-1">
                <input
                  type="radio"
                  name="sort-options"
                  id="low-to-high"
                  className="form-radio h-4 w-4 text-yellow"
                />
                <label
                  htmlFor="low-to-high"
                  className="ml-2 text-sm font-medium"
                >
                  Price (Low to High)
                </label>
              </span>
              <span className="flex items-center px-2 py-1">
                <input
                  type="radio"
                  name="sort-options"
                  id="high-to-low"
                  className="form-radio h-4 w-4 text-yellow"
                />
                <label
                  htmlFor="high-to-low"
                  className="ml-2 text-sm font-medium"
                >
                  Price (High to Low)
                </label>
              </span>
              <span className="flex items-center px-2 py-1">
                <input
                  type="radio"
                  name="sort-options"
                  id="star-1-to-5"
                  className="form-radio h-4 w-4 text-yellow"
                />
                <label
                  htmlFor="star-1-to-5"
                  className="ml-2 text-sm font-medium"
                >
                  Star 1 to 5
                </label>
              </span>
              <span className="flex items-center px-2 py-1">
                <input
                  type="radio"
                  name="sort-options"
                  id="star-5-to-1"
                  className="form-radio h-4 w-4 text-yellow"
                />
                <label
                  htmlFor="star-5-to-1"
                  className="ml-2 text-sm font-medium"
                >
                  Star 5 to 1
                </label>
              </span>
            </span>
          </span>
          <span className="border flex flex-col rounded-lg w-full">
            <span className="flex items-center justify-between p-2">
              <h3 className="text-sm font-medium ">Filters</h3>
              <button className="text-yellow text-sm font-medium">
                Clear All
              </button>
            </span>
            <span className="flex items-center justify-between border-b-2  border-dashed"></span>
            <span className="p-2 flex flex-col gap-3 mt-2">
              <span className="w-full">
                <p className="font-medium">Search Hotel</p>
                <span className="flex items-center gap-3 border p-1 rounded-lg w-full ">
                  <Image
                    src="/icons/search.png"
                    width={100}
                    height={100}
                    className="w-4 h-4"
                    alt="Hotel img"
                  />
                  <input type="text" placeholder="Search" className="w-full" />
                </span>
              </span>
              <span className="w-full ">
                <p className="font-medium">Search Location</p>
                <span className="flex items-center gap-3 border p-1 rounded-lg w-full ">
                  <Image
                    src="/icons/search.png"
                    width={100}
                    height={100}
                    className="w-4 h-4"
                    alt="Hotel img"
                  />
                  <input type="text" placeholder="Search" className="w-full" />
                </span>
              </span>
            </span>

            <span className="flex items-center justify-between border-b-2  border-dashed"></span>
            <span className="p-2">
              <h3 className="text-sm font-medium mb-2">Price Range</h3>
              {priceRanges.map((range) => (
                <div
                  className="flex items-center space-x-2 mb-3"
                  key={range.id}
                >
                  <input
                    type="checkbox"
                    id={range.id}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={range.id} className="text-sm text-gray-700">
                    {range.label}
                  </label>
                  <span className="text-gray-500 text-sm">({range.count})</span>
                </div>
              ))}
            </span>
            <span className="flex items-center justify-between border-b-2  border-dashed"></span>
            <span className="p-2">
              <h3 className="text-sm font-medium mb-2">Star Category</h3>
              {ratingStar.map((range) => (
                <div
                  className="flex items-center space-x-2 mb-3"
                  key={range.id}
                >
                  <input
                    type="checkbox"
                    id={range.id}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor={range.id}
                    className="text-sm text-gray-700 flex items-center gap-1"
                  >
                    {/* {Array.from({ length: range.count }, (_, index) => (
                      <Image
                        key={index}
                        src="/icons/starFilter.png"
                        width={100}
                        height={100}
                        alt={`${range.count} stars`}
                        className="w-4 h-4"
                      />
                    ))} */}
                  </label>
                </div>
              ))}
            </span>
            <span className="flex items-center justify-between border-b-2  border-dashed"></span>
            <span className="p-2">
              <h3 className="text-sm font-medium mb-2">Property Type</h3>
              {propertyType.map((range) => (
                <div
                  className="flex items-center space-x-2 mb-1"
                  key={range.id}
                >
                  <input
                    type="checkbox"
                    id={range.id}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={range.id} className="text-sm text-gray-700">
                    {range.label}
                  </label>
                </div>
              ))}
            </span>
          </span>
        </div>

        {/* Flight Options Section */}
        {loading ? (
          <Simmer />
        ) : (
          <div className="rounded-xl overflow-y-auto p-0 flex-1">
            {/* Flight Details */}
            <div className="mt-0 flex flex-col gap-4">
              {hotelList.map((hotel) => {
                const exchangeRate = 82; // Example rate
                const priceInINR =
                  hotel.rate && hotel.rate.totalRate
                    ? (hotel.rate.totalRate * exchangeRate).toFixed(2)
                    : null;

                return (
                  <Link
                    key={hotel.id}
                    href={`/hotels/${hotel.id}/${encodeURIComponent(
                      hotel.name
                    )}?searchid=${token}`}
                    className="block"
                  >
                    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg flex flex-col md:flex-row justify-between gap-4 hover:shadow-2xl transition-all ease-in-out duration-300 cursor-pointer">
                      {/* Hotel Image */}
                      <div className="flex-shrink-0 w-full md:w-[200px] h-[200px]">
                        <img
                          src={hotel.image}
                          alt={hotel.name}
                          className="rounded-lg w-full h-full object-cover"
                        />
                      </div>

                      {/* Hotel Information */}
                      <div className="flex flex-col gap-3 flex-1">
                        <div className="flex items-center justify-between gap-4">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {hotel.name}
                          </h4>
                          <p className="text-sm text-yellow-500">
                            {hotel.rating} Stars
                          </p>
                        </div>
                        <p className="text-sm text-blue-600">
                          {hotel.location}
                        </p>
                      </div>

                      {/* Pricing Section */}
                      <div className="md:border-l md:px-4 px-1 flex flex-col justify-center items-center">
                        <p className="text-yellow text-xl font-semibold">
                          {priceInINR === null ? (
                            <div className="w-6 h-6 border-4 border-t-yellow border-gray-200 rounded-full animate-spin"></div>
                          ) : priceInINR ? (
                            <span>Price: ₹{priceInINR}</span>
                          ) : (
                            <span>Price: Not available</span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">Per Night</p>
                      </div>
                    </div>
                  </Link>
                );
              })}

              {/* Cashback Offer */}
              {hotelList.length > 0 && (
                <div className="bg-blue-600 rounded-lg px-4 py-2 mt-2 text-center">
                  <p className="text-sm text-white">
                    Get INR 742 Cashback on payments via credit/debit cards
                  </p>
                </div>
              )}

              {/* View More Button */}
              {hotelList.length > 0 && (
                <div className="mt-4 text-center">
                  <Link
                    href="#"
                    className="text-blue-600 text-sm font-semibold hover:underline"
                  >
                    View More Hotels
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
