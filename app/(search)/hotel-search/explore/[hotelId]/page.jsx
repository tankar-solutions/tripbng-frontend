"use client";

import Button from "@/components/ui/button";
import { roomData } from "@/constants/data/roomData";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const router = useRouter();
  return (
    <div className="md:container py-10 px-3 md:px-3 flex flex-col gap-4">
      {" "}
      <div className=" grid-cols-5 bg-white rounded-xl hidden sm:grid w-full ">
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
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm my-2">
        <p className="text-blue font-medium">Home</p>
        <ChevronRight size={14} color="grey" />
        <p className="text-blue font-medium">Hotels In Ahmedabad</p>
        <ChevronRight size={14} color="grey" />
        <p className=" font-medium">Hyatt Ahmedabad</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <div>
          <h1 className=" md:text-xl  font-semibold ">
            Hard Rock Hotel Goa Calangute
          </h1>
          <div class="flex  gap-3 py-3 flex-col md:flex-row">
            <div class="basis-4/6 bg-blue-200 ">
              <div class="flex w-full gap-3 md:h-96 h-60">
                <div class="basis-4/6 h-full relative">
                  <div class="absolute inset-0 bg-black bg-opacity-10 rounded-lg"></div>
                  <p className="absolute text-sm bottom-3 left-3 text-white font-semibold">
                    +102 property photos
                  </p>
                  <Image
                    src="/hotels/hotel8.jpg"
                    class="h-full w-full rounded-lg object-cover"
                    width={600} height={400}
                    alt="Hotel img"
                  />
                </div>
                <div class="basis-2/6 flex flex-col justify-between h-full">
                  <div class="relative h-[calc(50%-6px)]">
                    <div class="absolute inset-0 bg-black bg-opacity-20 rounded-lg"></div>
                    <p className="absolute text-sm bottom-3 left-3 text-white font-semibold">
                      360 View
                    </p>
                    <Image
                      src="/hotels/hotel2.jpg"
                      class="h-full w-full rounded-lg object-cover"
                      width={600}
                      height={100}
                      alt="Hotel img"
                    />
                  </div>
                  <div class="relative h-[calc(50%-6px)]">
                    <div class="absolute inset-0 bg-black bg-opacity-20 rounded-lg"></div>
                    <p className="absolute text-sm bottom-3 left-3 text-white font-semibold">
                      +1576 guest photos
                    </p>
                    <Image
                      src="/hotels/hotel3.jpg"
                      class="h-full w-full rounded-lg object-cover"
                      width={600}
                      height={100}
                      alt="Hotel img"
                    />
                  </div>
                </div>
              </div>
              <p className="leading-tight mt-2 text-gray-500 text-sm md:text-lg">
                Nestled in Calangute’s heart, Hard Rock Hotel is a complete
                entertainment destination where one lives like a rockstar with
                top leisure amenities and proximity to top attractions.
              </p>
              <div className="flex items-center gap-3 mt-4">
                <span className="flex items-center gap-2 py-2  px-3 border border-yellow rounded-lg bg-yellow/20">
                  <Image src="/hotels/spoon.png" className="w-6 h-6" alt="Hotel img" width={100} height={100}/>
                  <p className="text-sm font-medium">Food and Dining</p>
                </span>
                <span className="flex items-center gap-2 py-2  px-3 border border-yellow rounded-lg bg-yellow/20">
                  <Image src="/hotels/location.png" width={100} height={100} className="w-6 h-6" alt="Hotel img"/>
                  <p className="text-sm font-medium">Location & Surroundings</p>
                </span>
              </div>
              <div className="mt-6">
                <h2 className="text-lg font-semibold ">Amenities</h2>
                <ul className="py-3 flex flex-wrap items-center gap-4">
                  <li className="flex items-center gap-2">
                    <Image src="/hotels/breakfast.png" width={100} height={100} className="w-6 h-6" alt="Hotel img" />
                    <p className="text-gray-500 font-light text-sm">Gym</p>
                  </li>
                  <li className="flex items-center gap-2">
                    <Image src="/hotels/swimming.png" width={100} height={100} className="w-6 h-6" alt="Hotel img"/>
                    <p className="text-gray-500 font-light text-sm">
                      Swimming Pool
                    </p>
                  </li>
                  <li className="flex items-center gap-2">
                    <Image src="/hotels/spa.png" width={100} height={100} className="w-6 h-6" alt="Hotel img"/>
                    <p className="text-gray-500 font-light text-sm">Spa</p>
                  </li>
                  <button className="text-blue font-semibold text-sm">
                    + 48 Amenities{" "}
                  </button>
                </ul>
              </div>
              <div className="mt-6">
                <h2 className="text-lg font-semibold ">
                  Discover the Best of Luxury
                </h2>
                <ul className="flex md:flex-row flex-col items-center gap-3 mt-2">
                  <li className="border rounded-lg w-full flex items-center justify-between gap-2">
                    <p className="ml-3 font-medium md:w-36 text-center">
                      Soothing Spa Therapies
                    </p>
                    <span className="border-2 border-yellow rounded-lg p-0.5 ">
                      <Image
                        src="/hotels/hotel6.jpg"
                        width={100} height={100}
                        className="w-14 h-14 object-cover rounded-lg"
                        alt="Hotel img"
                      />
                    </span>
                  </li>
                  <li className="border rounded-lg w-full flex items-center justify-between gap-2">
                    <p className="ml-3 font-medium md:w-36 text-center">
                      Open Air Outdoor Pool
                    </p>
                    <span className="border-2 border-yellow rounded-lg p-0.5 ">
                      <Image
                        src="/hotels/hotel7.jpg"
                        width={100} height={100}
                        className="w-14 h-14 object-cover rounded-lg"
                        alt="Hotel img"
                      />
                    </span>
                  </li>
                  <li className="border rounded-lg w-full flex items-center justify-between gap-2">
                    <p className="ml-3 font-medium md:w-36 text-center">
                      Swanky Eatery & Bar
                    </p>
                    <span className="border-2 border-yellow rounded-lg p-0.5 ">
                      <Image
                        src="/hotels/hotel8.jpg"
                        width={100} height={100}
                        className="w-14 h-14 object-cover rounded-lg"
                        alt="Hotel img"
                      />
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div class="basis-2/6 ">
              <div className="room-info p-4 border rounded-lg mb-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold">
                    Deluxe Room Twin Bed
                  </h2>
                  <p className="text-sm sm:text-lg text-gray-600 font-medium">
                    Fits 2 Adults
                  </p>
                </div>

                <ul className="flex flex-col gap-2 mt-3">
                  <li className="flex items-center">
                    <Image
                      src="/icons/breakfast.png"
                      width={100} height={100}
                      alt="Breakfast icon"
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    />
                    <span className="ml-2 text-xs sm:text-sm text-green-400">
                      Breakfast included
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Image
                      src="/icons/dot.png"
                      alt="WiFi icon"
                      width={100} height={100}
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    />
                    <span className="ml-2 text-xs sm:text-sm">
                      Non-Refundable
                    </span>
                  </li>
                </ul>

                <div className="pricing mt-4 flex flex-wrap items-center gap-3">
                  <p className="text-xs sm:text-sm text-gray-600 font-semibold line-through">
                    ₹ 8,249
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">Per Night</p>
                </div>

                <div className="final-price mt-1 flex flex-wrap items-baseline gap-3">
                  <p className="text-xl sm:text-2xl font-bold">₹ 5,432</p>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">
                    + ₹ 1,501 taxes & fees
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <button
                    className="w-full sm:w-auto py-2 px-5 rounded-lg text-white font-semibold shadow-lg"
                    style={{
                      background: "linear-gradient(92deg, #FF8E00, #FFB300)",
                    }}
                  >
                    BOOK THIS NOW
                  </button>
                  <button className="w-full sm:w-auto py-2 px-5 text-blue font-semibold">
                    11 More Options
                  </button>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <h2 className="bg-yellow text-white font-bold text-xl sm:text-2xl py-2 sm:py-3 px-3 sm:px-4 rounded-lg">
                      4.1
                    </h2>
                    <span className="flex flex-wrap items-center gap-2">
                      <p className="text-yellow font-semibold text-base sm:text-lg">
                        Very Good
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        (5744 RATINGS)
                      </p>
                    </span>
                  </div>
                  <button className="text-blue font-semibold text-sm sm:text-base">
                    All Reviews
                  </button>
                </div>
                <span className="border-b flex my-2"></span>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Image
                      src="/hotels/map.png"
                      width={100} height={100}
                      className="h-8 sm:h-10 w-12 sm:w-14"
                      alt="Hotel img"
                    />
                    <span className="flex flex-wrap items-center gap-2">
                      <p className="text-yellow font-semibold text-base sm:text-lg">
                        Very Good
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        (5744 RATINGS)
                      </p>
                    </span>
                  </div>
                  <button className="text-blue font-semibold text-sm sm:text-base">
                    All Reviews
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Section */}
        <div>
          <p className="text-base md:text-lg font-semibold">
            Change Dates and Guest(s)
          </p>
          <p className="text-sm md:text-lg font-medium text-gray-500">
            Check-in: 3 PM | Check-out: 12 PM
          </p>
        </div>

        {/* Right Section */}
        <div className="flex flex-col md:flex-row flex-wrap items-center gap-2 w-full md:w-auto">
          <button className="border py-2 px-4 rounded-lg flex items-center justify-between gap-2 w-full md:w-auto text-sm md:text-base">
            Thu, 23 Jan 2025
            <Image src="/hotels/down.png" width={100} height={100} className="w-5 h-5 md:w-6 md:h-6" alt="Hotel img" />
          </button>
          <button className="border py-2 px-4 rounded-lg flex items-center justify-between gap-2 w-full md:w-auto text-sm md:text-base">
            Fri, 24 Jan 2025
            <Image src="/hotels/down.png" width={100} height={100} className="w-5 h-5 md:w-6 md:h-6" alt="Hotel img" />
          </button>
          <button className="border py-2 px-4 rounded-lg flex items-center justify-between gap-2 w-full md:w-auto text-sm md:text-base">
            2 Adults
            <Image src="/hotels/down.png" width={100} height={100} className="w-5 h-5 md:w-6 md:h-6" alt="Hotel img"/>
          </button>
          <button className="border-2 border-yellow py-2 px-4 rounded-lg text-yellow font-medium w-full md:w-auto text-sm md:text-base">
            Update Search
          </button>
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <h2 className="md:text-lg text-sm font-semibold flex items-center gap-1">
          5 Room Types <Image src="/hotels/down.png" width={100} height={100} className="w-6 h-6" alt="Hotel img"/>
        </h2>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <button className="border py-2 px-4 rounded-lg flex items-center gap-2">
            Breakfast Included
          </button>
          <button className="border py-2 px-4 rounded-lg flex items-center gap-2">
            Breakfast & Lunch/Dinner Included
          </button>
        </div>
        <div className="border rounded-lg mt-3">
          <section className="p-2">
            <p className="text-gray-500">
              Deal Applied:{" "}
              <span className="text-black font-semibold text-lg">
                WELCOMETRIP
              </span>
              . Big Savings! Get INR 2979 Off
            </p>
          </section>

          <div className="space-y-4">
            {roomData.map((room) => (
              <div
                key={room.id}
                className="border-t flex flex-wrap lg:flex-nowrap items-start"
              >
                <div className="w-full lg:w-[25%] border-r">
                  <div className="p-4">
                    <button onClick={() => openModal()}>
                      <Image
                        src={room.imageSrc}
                        alt={room.altText}
                        width={100} height={100}
                        className="rounded-lg w-full"
                      />
                    </button>
                    <div className="mt-2">
                      <h3 className="font-semibold text-base lg:text-lg">
                        {room.roomName}
                      </h3>
                      <p className="text-gray-500 text-sm">{room.roomSize}</p>
                    </div>

                    <ul className="flex flex-wrap items-center gap-2 mt-2">
                      {room.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-1">
                          <Image
                          
                            src="/icons/dot.png"
                            alt="Feature"
                            width={100} height={100}
                            className="w-5 h-5 sm:w-6 sm:h-6"
                          />
                          <p className="text-sm text-gray-500">{feature}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="w-full lg:w-[75%] flex flex-col sm:flex-row items-start lg:items-center justify-between p-4 gap-4">
                  <div className="w-full sm:w-[60%]">
                    <div className="mb-2">
                      <h3 className="text-lg sm:text-xl font-semibold">
                        {room.roomDescription.name}
                      </h3>
                      <h4 className="text-base text-gray-600">
                        {room.roomDescription.subTitle}
                      </h4>
                    </div>

                    <p className="text-sm sm:text-base">
                      {room.roomDescription.capacity}
                    </p>

                    <div className="flex items-center mt-2 gap-2">
                      <Image
                        src="/hotels/spoon.png"
                        alt="Meal option"
                        width={100} height={100}
                        className="w-5 h-5 sm:w-6 sm:h-6"
                      />
                      <p className="text-sm sm:text-lg font-medium">
                        {room.roomDescription.mealOption}
                      </p>
                    </div>

                    {room.roomDescription.specialNotes.map((note, index) => (
                      <p
                        key={index}
                        className={
                          note.includes("Refundable")
                            ? "text-green-500 text-sm sm:text-base"
                            : "text-red-500 text-sm sm:text-base"
                        }
                      >
                        {note}
                      </p>
                    ))}
                    <p className="text-sm sm:text-base">
                      Instructions: {room.roomDescription.instructions}
                    </p>
                  </div>

                  <div className="flex flex-col items-end w-full sm:w-[40%]">
                    <h2 className="text-lg sm:text-xl font-semibold">
                      {room.roomDescription.price}
                    </h2>
                    <h3 className="text-sm sm:text-base font-medium">
                      {room.roomDescription.taxes}
                    </h3>
                    <p className="text-sm sm:text-base font-medium text-gray-500">
                      {room.roomDescription.roomType}
                    </p>
                    <button className="bg-yellow py-2 px-4 w-full sm:w-auto rounded-lg text-white font-semibold mt-2 mb-1">
                      Book Room
                    </button>
                    <button className="text-yellow font-semibold underline w-full sm:w-auto">
                      KNOW MORE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isModalOpen && (
            <div
              className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
              onClick={closeModal}
            >
              <div
                className="bg-white rounded-xl w-11/12 sm:w-1/1 lg:w-2/3"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-3 flex items-center justify-between border-b-2 ">
                  <p>
                    Standard Twin Dormitory with Bunk Beds (Shared Facilities)
                  </p>
                  <button
                    onClick={closeModal}
                    className="text-gray-600 hover:text-gray-800 p-2 rounded-full"
                  >
                    <FaTimes className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-4 border-b">
                  <span className="flex items-center gap-2">
                    <Image src="/hotels/breakfast.png" width={100} height={100} className="w-6 h-6" alt="Hotel img"/>
                    <p>King Bed Sized</p>
                  </span>
                  </div>
                  <div className="p-4">
                  <h1 className="text-xl font-semibold">Room Features</h1>
                  <span className="flex items-center gap-2">
                    <Image src="/icons/dot.png" width={100} height={100} className="w-6 h-6" alt="Hotel img"/>
                    <p>Room Only</p>
                  </span>
                    </div>
                  <div className="p-4">
                  <h1 className="text-xl font-semibold">Room Description</h1>
                  <span className="flex items-center gap-2">
                    <Image src="/icons/dot.png" width={100} height={100} className="w-6 h-6" alt="Hotel img"/>
                    <p>Shared Dormitory, Multiple Beds (4 Twin Bunk Beds)</p>
                  </span>
                    </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
