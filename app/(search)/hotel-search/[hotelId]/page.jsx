"use client";

import FilterModalHotel from "@/components/FilterModalHotel";
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
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const datePrice = [
  { id: "Sun, 25 Aug", price: "$125" },
  { id: "Mon, 26 Aug", price: "$150" },
  { id: "Tue, 27 Aug", price: "$175" },
  { id: "Wed, 28 Aug", price: "$200" },
  { id: "Thu, 29 Aug", price: "$225" },
  { id: "Fri, 30 Aug", price: "$250" },
  { id: "Sat, 31 Aug", price: "$300" },
];

export default function Page() {
  const router = useRouter();
  const [viewPriceSection, setViewPriceSection] = useState(false);
  const [isModalOpenFilter, setModalOpenFilter] = useState(false);
  const [hotelList,setHotelList] = useState([])
  const handleModalToggle = () => {
    setModalOpenFilter(!isModalOpenFilter);
  };

  function handleViewPriceSection() {
    setViewPriceSection(!viewPriceSection);
  }
useEffect(()=>{
  getHotelListFirstCall()
},[])

const getHotelListFirstCall = async () => {
  try {
    const response = await axios.get(
      "https://nexus.prod.zentrumhub.com/api/hotel/availability/async/269df81c-edb8-470f-979e-78162d561db0/results",
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          accountId: "zentrum-demo-account",
          "customer-ip": "54.86.50.139",
          correlationId: "6b79055c-3b28-a325-0d5f-72c8f654b345",
          apiKey: "demo123",
        },
      }
    );

    if (response.status === 200) {
      console.log("Fetched hotel list:", response.data.hotels);
      setHotelList(response?.data?.hotels);
    } else {
      console.log("Failed to fetch availability:", response.status);
    }
  } catch (error) {
    console.error("Error during hotel availability search:", error);
  }
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

        <button onClick={handleModalToggle}>
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
        onClose={handleModalToggle}
      />
      <div className=" grid-cols-5 py-10 bg-white rounded-xl hidden md:grid w-full ">
        <div className="border rounded-l-xl p-4">
          <p className="text-sm">CITY, AREA or PROPERTY</p>
          <p className="text-md font-semibold">Hard rock hotel goa</p>
        </div>
        <div className="border p-4">
          <p className="text-sm">Check-In</p>
          <p className="text-md font-semibold">Fri, 17 Jan 2025 </p>
        </div>
        <div className="border p-4">
          <p className="text-sm">Check-Out </p>
          <p className="text-md font-semibold">Wed, 28 Aug</p>
        </div>
        <div className="border p-4">
          <p className="text-sm">Rooms & Guests</p>
          <p className="text-md font-semibold">1 Room, 2 Adults</p>
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
            <p className="text-sm font-medium">Total 673 hotels found</p>
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
        <div className=" rounded-xl overflow-y-auto p-0 flex-1">
          {/* Flight Details */}
          <div className="mt-0 flex flex-col gap-4">
            {hotelList.map((el) => (
              <div key={el.id}>
                <Link
                  href={`/hotel-search/explore/7897868796gasyudcg78`}
                  className="bg-white p-4 md:p-6 rounded-xl shadow-lg flex flex-col md:flex-row justify-between gap-4"
                >
                  {/* Images Section */}
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* <Image
                      src={el.images[0]}
                      alt="Hotel Image"
                      width={100}
                      height={100}
                      className="rounded-lg w-full md:w-[200px] h-[200px] object-cover"
                    /> */}
                    <div className="flex md:flex-col gap-2">
                      {/* <Image
                        src={el.images[1]}
                        alt="Hotel Image"
                        width={100}
                        height={100}
                        className="rounded-lg h-[100px] md:w-[100px] w-[50%] object-cover"
                      />
                      <Image
                        src={el.images[2]}
                        alt="Hotel Image"
                        width={100}
                        height={100}
                        className="rounded-lg h-[100px] md:w-[100px] w-[50%] object-cover"
                      /> */}
                    </div>
                  </div>

                  {/* Hotel Information Section */}
                  <div className="flex flex-col gap-3 flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <h4 className="text-lg font-semibold">{el.title}</h4>
                      <p className="text-sm">{el.rating} Star</p>
                    </div>
                    <p className="text-sm text-blue">{el.location}</p>
                    <div>
                      <p className="mb-2 text-sm font-medium">
                        Property Offers
                      </p>
                      {/* <div className="flex flex-wrap gap-2">
                        {el.propertyOffers.map((offer, index) => (
                          <p
                            key={index}
                            className="text-sm text-gray-500 px-2 py-1 rounded-md border"
                          >
                            {offer}
                          </p>
                        ))}
                      </div> */}
                    </div>
                    {/* <ul>
                      {el.description.map((description, index) => (
                        <li
                          key={index}
                          className="text-sm text-green-500 list-inside list-disc"
                        >
                          {description}
                        </li>
                      ))}
                    </ul> */}
                  </div>

                  {/* Price and Rating Section */}
                  <div className="md:border-l md:px-4 px-1 flex flex-row md:flex-col justify-between items-start md:items-center gap-4">
                    {/* Rating and Reviews Section */}
                    <div>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium">Excellent</p>
                        <span className="text-xs text-gray-500">
                          (687 Ratings)
                        </span>
                      </div>

                      {/* Rating Button */}
                      <div className="flex gap-2 items-center mt-2">
                        <button className="text-sm rounded-md bg-yellow text-white px-3 py-2">
                          4.2
                        </button>
                        <button className="text-sm rounded-md bg-blue/10 text-blue px-4 py-1">
                          Offer/Notes
                        </button>
                      </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="flex flex-col gap-1 text-sm text-gray-500 items-end">
                      <p>Per Night</p>
                      <p>Excluded fees & Taxes</p>
                      <p className="text-yellow text-lg font-semibold">
                        {el.priceRange}
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Cashback Offer */}
                <div className="bg-blue rounded-lg px-4 py-1 mt-2">
                  <p className="text-sm text-white">
                    Get INR 742 Cashback to Card on payments via credit/debit
                    cards
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
