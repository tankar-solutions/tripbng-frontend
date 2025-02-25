"use client";

import axios from "axios";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import Image from "next/image";
import Button from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PriceRateModal from "@/components/PriceRateModal";

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Extract hotel ID from URL path
  const pathSegments = pathname.split("/");
  const hotelId = pathSegments[2];

  // Extract search token from query parameters
  const searchToken = searchParams.get("searchid");

  // State variables
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [hotelDetails, setHotelDetails] = useState(null);
  const [isModalOpenImg, setIsModalOpenImg] = useState(false);
  const [isPriceRateModal, setIsPriceRateModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Get all images with Standard size
  const standardImages = hotelDetails?.images
    ?.map((img) => img.links.find((link) => link.size === "Standard"))
    ?.filter(Boolean);

  // Function to open/close modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Fetch room prices and hotel content
  useEffect(() => {
    if (hotelId && searchToken) {
      getRoomsAndRates(hotelId, searchToken);
      getHotelContent(hotelId);
    }
  }, [hotelId, searchToken]);

  const handlePriceOpenModal = (room) => {
    setSelectedRoom(room);
    setIsPriceRateModal(true);
  };
  
  const handlePriceCloseModal = () => {
    setSelectedRoom(null);
    setIsPriceRateModal(false);
  };

  // API: Fetch Room Prices & Availability
  const getRoomsAndRates = async (hotelId, searchToken) => {
    try {
      const response = await axios.post(
        `https://nexus.prod.zentrumhub.com/api/hotel/${hotelId}/roomsandrates/${searchToken}`,
        { searchSpecificProviders: false },
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
        console.log("Rooms Data:", response.data);
        setRooms(response.data.hotel || []);
      } else {
        console.error("Failed to fetch rooms:", response.status);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  // API: Fetch Hotel Content (Name, Images, Description)
  const getHotelContent = async (hotelId) => {
    try {
      const response = await axios.post(
        `https://nexus.prod.zentrumhub.com/api/content/hotelcontent/getHotelContent`,
        {
          hotelIds: [hotelId],
          channelId: "client-demo-channel",
          culture: "en-US",
          contentFields: ["All"],
        },
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
        console.log("Hotel Details:", response.data);
        setHotelDetails(response.data.hotels?.[0] || null);
      } else {
        console.error("Failed to fetch hotel details:", response.status);
      }
    } catch (error) {
      console.error("Error fetching hotel details:", error);
    }
  };

  // 1. Mapping recommendations into grouped rooms per recommendation
  const mapGroupedRecommendations = () => {
    if (!rooms || !rooms.recommendations) return [];
    const {
      recommendations,
      rates,
      standardizedRooms,
      rooms: roomList,
    } = rooms;
    return recommendations.map((rec) => {
      const rateObjs = rec.rates
        .map((rateId) => {
          const rate = rates.find((r) => r.id === rateId);
          let room = null;
          if (rate && rate.occupancies && rate.occupancies.length > 0) {
            if (standardizedRooms) {
              const stdRoomId = rate.occupancies[0].stdRoomId;
              room = standardizedRooms.find((r) => r.id === stdRoomId);
            } else {
              const roomId = rate.occupancies[0].roomId;
              room = roomList.find((r) => r.id === roomId);
            }
          }
          return rate && room ? { rate, room } : null;
        })
        .filter(Boolean);
      // Group rates by room.id for this recommendation
      const grouped = {};
      rateObjs.forEach(({ rate, room }) => {
        if (room) {
          if (!grouped[room.id]) {
            grouped[room.id] = { room, rates: [] };
          }
          grouped[room.id].rates.push(rate);
        }
      });
      return { recommendation: rec, groupedRooms: Object.values(grouped) };
    });
  };

  const groupedData = mapGroupedRecommendations();

  // 2. Merge grouped rooms from all recommendations by room ID
  const mergeGroupedRoomsAcrossRecs = () => {
    const mergedRooms = {};
    groupedData.forEach((item) => {
      item.groupedRooms.forEach((group) => {
        const roomId = group.room.id;
        if (!mergedRooms[roomId]) {
          mergedRooms[roomId] = {
            room: group.room,
            rates: [...group.rates],
            recommendations: [item.recommendation.id], // track which recommendations produced this room
          };
        } else {
          mergedRooms[roomId].rates.push(...group.rates);
          mergedRooms[roomId].recommendations.push(item.recommendation.id);
        }
      });
    });
    return Object.values(mergedRooms);
  };

  const mergedRoomList = mergeGroupedRoomsAcrossRecs();
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    adaptiveHeight: true, // Ensures the height adjusts dynamically
    appendDots: (dots) => (
      <div style={{ marginTop: "-5px" }}>
        {" "}
        {/* Reduce space between image and dots */}
        <ul style={{ margin: "-10px", padding: "0px" }}>{dots}</ul>
      </div>
    ),
  };

  return (
    <div className="md:container py-10 px-3 md:px-3 flex flex-col gap-4">
      {" "}
      <div className=" grid-cols-5 bg-white rounded-xl hidden sm:grid w-full ">
        <div className="border rounded-l-xl p-4">
          <p className="text-sm">CITY, AREA or PROPERTYsss</p>
          <p className="text-md font-semibold"> {hotelDetails?.name || ""}</p>
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
            {hotelDetails?.name || ""}
          </h1>
          <div class="flex  gap-3 py-3 flex-col md:flex-row">
            <div class=" bg-blue-200 ">
              <div class="flex w-full gap-3 md:h-96 h-60">
                <div
                  className="basis-4/6 h-full relative"
                  onClick={() => setIsModalOpenImg(true)}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-10 rounded-lg"></div>
                  <p className="absolute text-sm bottom-3 left-3 text-white font-semibold">
                    +{hotelDetails?.images?.length || 0} property photos
                  </p>
                  {hotelDetails?.images?.[0]?.links?.find(
                    (link) => link.size === "Standard"
                  )?.url && (
                    <Image
                      src={
                        hotelDetails.images[0].links.find(
                          (link) => link.size === "Standard"
                        ).url
                      }
                      className="h-full w-full rounded-lg object-cover"
                      width={600}
                      height={400}
                      alt="Hotel Image"
                      unoptimized={true}
                    />
                  )}
                </div>

                <div className="basis-2/6 flex flex-col justify-between h-full">
                  {hotelDetails?.images?.slice(1, 3).map((image, index) => (
                    <div key={index} className="relative h-[calc(50%-6px)]">
                      <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg"></div>
                      <p className="absolute text-sm bottom-3 left-3 text-white font-semibold">
                        {image.caption || "Hotel Photo"}
                      </p>
                      {image?.links?.find((link) => link.size === "Standard")
                        ?.url && (
                        <Image
                          src={
                            image.links.find((link) => link.size === "Standard")
                              .url
                          }
                          className="h-full w-full rounded-lg object-cover"
                          width={600}
                          height={100}
                          alt="Hotel Image"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="basis-2/6 flex flex-col justify-between h-full">
                  {hotelDetails?.images?.slice(4, 6).map((image, index) => (
                    <div key={index} className="relative h-[calc(50%-6px)]">
                      <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg"></div>
                      <p className="absolute text-sm bottom-3 left-3 text-white font-semibold">
                        {image.caption || "Hotel Photo"}
                      </p>
                      {image?.links?.find((link) => link.size === "Standard")
                        ?.url && (
                        <Image
                          src={
                            image.links.find((link) => link.size === "Standard")
                              .url
                          }
                          className="h-full w-full rounded-lg object-cover"
                          width={600}
                          height={100}
                          alt="Hotel Image"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <p className="leading-tight mt-2 text-gray-500 text-sm md:text-lg">
                Nestled in Calangute’s heart, Hard Rock Hotel is a complete
                entertainment destination where one lives like a rockstar with
                top leisure amenities and proximity to top attractions.
              </p>
              <div className="flex items-center gap-3 mt-4">
                <span className="flex items-center gap-2 py-2  px-3 border border-yellow rounded-lg bg-yellow/20">
                  <Image
                    src="/hotels/spoon.png"
                    className="w-6 h-6"
                    alt="Hotel img"
                    width={100}
                    height={100}
                  />
                  <p className="text-sm font-medium">Food and Dining</p>
                </span>
                <span className="flex items-center gap-2 py-2  px-3 border border-yellow rounded-lg bg-yellow/20">
                  <Image
                    src="/hotels/location.png"
                    width={100}
                    height={100}
                    className="w-6 h-6"
                    alt="Hotel img"
                  />
                  <p className="text-sm font-medium">Location & Surroundings</p>
                </span>
              </div>
              <div className="mt-6">
                <h2 className="text-lg font-semibold ">Amenities</h2>
                <ul className="py-3 flex flex-wrap items-center gap-4">
                  <li className="flex items-center gap-2">
                    <Image
                      src="/hotels/breakfast.png"
                      width={100}
                      height={100}
                      className="w-6 h-6"
                      alt="Hotel img"
                    />
                    <p className="text-gray-500 font-light text-sm">Gym</p>
                  </li>
                  <li className="flex items-center gap-2">
                    <Image
                      src="/hotels/swimming.png"
                      width={100}
                      height={100}
                      className="w-6 h-6"
                      alt="Hotel img"
                    />
                    <p className="text-gray-500 font-light text-sm">
                      Swimming Pool
                    </p>
                  </li>
                  <li className="flex items-center gap-2">
                    <Image
                      src="/hotels/spa.png"
                      width={100}
                      height={100}
                      className="w-6 h-6"
                      alt="Hotel img"
                    />
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
                        width={100}
                        height={100}
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
                        width={100}
                        height={100}
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
                        width={100}
                        height={100}
                        className="w-14 h-14 object-cover rounded-lg"
                        alt="Hotel img"
                      />
                    </span>
                  </li>
                </ul>
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
            <Image
              src="/hotels/down.png"
              width={100}
              height={100}
              className="w-5 h-5 md:w-6 md:h-6"
              alt="Hotel img"
            />
          </button>
          <button className="border py-2 px-4 rounded-lg flex items-center justify-between gap-2 w-full md:w-auto text-sm md:text-base">
            Fri, 24 Jan 2025
            <Image
              src="/hotels/down.png"
              width={100}
              height={100}
              className="w-5 h-5 md:w-6 md:h-6"
              alt="Hotel img"
            />
          </button>
          <button className="border py-2 px-4 rounded-lg flex items-center justify-between gap-2 w-full md:w-auto text-sm md:text-base">
            2 Adults
            <Image
              src="/hotels/down.png"
              width={100}
              height={100}
              className="w-5 h-5 md:w-6 md:h-6"
              alt="Hotel img"
            />
          </button>
          <button className="border-2 border-yellow py-2 px-4 rounded-lg text-yellow font-medium w-full md:w-auto text-sm md:text-base">
            Update Search
          </button>
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <h2 className="md:text-lg text-sm font-semibold flex items-center gap-1">
          5 Room Types{" "}
          <Image
            src="/hotels/down.png"
            width={100}
            height={100}
            className="w-6 h-6"
            alt="Hotel img"
          />
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
          <div className="space-y-6">
            {rooms ? (
              <div>
                {mergedRoomList.length > 0 ? (
                  mergedRoomList.map((group) => (
                    <div
                      key={group.room.id}
                      className="border-t py-6 flex flex-wrap lg:flex-nowrap items-start"
                    >
                      {/* Left Column: Room Image Slider */}
                      <div className="w-full lg:w-[25%] border-r">
                        <div className="p-4">
                          {group.room.images && group.room.images.length > 0 ? (
                            <Slider {...sliderSettings}>
                              {group.room.images.map((image, index) =>
                                image.links.map((link, linkIdx) =>
                                  link.size === "Standard" ? (
                                    <div
                                      key={`${index}-${linkIdx}`}
                                      className="p-1"
                                    >
                                      <Image
                                        src={link.url}
                                        alt={`Room Image ${index + 1}`}
                                        width={400}
                                        height={400}
                                        className="rounded-lg object-cover"
                                      />
                                    </div>
                                  ) : null
                                )
                              )}
                            </Slider>
                          ) : (
                            <div className="p-2">
                              <Image
                                src="/placeholder.jpg"
                                alt="No image available"
                                width={200}
                                height={150}
                                className="rounded-lg"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Center Column: Room Details */}
                      <div className="w-full lg:w-1/3 p-4">
                        <h3 className="text-2xl font-bold text-gray-800">
                          {group.room.name}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {group.room.facilities?.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-md font-semibold text-gray-700">
                                Facilities:
                              </h4>
                              <ul className="list-disc list-inside space-y-1">
                                {group.room.facilities
                                  .slice(0, 5)
                                  .map((facility, index) => (
                                    <li
                                      key={index}
                                      className="text-sm text-gray-600"
                                    >
                                      {facility.name}
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          )}
                        </p>
                        {/* You can add more room details here if needed */}
                      </div>

                      {/* Right Column: Rates List */}
                      <div className="w-full lg:w-1/2 p-4 flex flex-col justify-center">
                        <div className="mb-4">
                          <p className="text-lg font-semibold text-gray-700 pb-2">
                            Available Rates
                          </p>
                        </div>
                        {group.rates.map((rate, idx) => (
                          <div
                            key={idx}
                            className="w-full mb-4 flex flex-col md:flex-row md:items-center justify-between bg-white shadow-md p-4 rounded-lg"
                          >
                            <div className="space-y-1">
                              <p className="bg-green-500 text-white px-2 py-1 rounded inline-block text-sm">
                                Package Rate
                              </p>
                              <p className="text-sm text-gray-700">
                                {rate.includes[0]}
                              </p>
                              <p className="text-sm text-gray-700">
                                Non-refundable
                              </p>
                              <p className="text-sm text-gray-700">
                                Flexible policies
                              </p>
                            </div>
                            <div className="text-right mt-2 md:mt-0">
                              <p className="text-lg font-bold text-gray-800">
                                {/* <span className="line-through text-sm text-gray-500 mr-2">
                                  ₹125,557.26
                                </span> */}
                                <span>₹{rate.baseRate}</span>
                              </p>
                              <p className="text-sm text-gray-600">per night</p>
                              <p className="text-sm text-gray-600">
                                Total: ₹{rate.totalRate}
                              </p>
                              <button className="mt-2 bg-yellow hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm" onClick={() => handlePriceOpenModal(group)}>
                                Book Now
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-600">
                    No recommendations available.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-600">Loading hotel data...</p>
            )}
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
                    <Image
                      src="/hotels/breakfast.png"
                      width={100}
                      height={100}
                      className="w-6 h-6"
                      alt="Hotel img"
                    />
                    <p>King Bed Sized</p>
                  </span>
                </div>
                <div className="p-4">
                  <h1 className="text-xl font-semibold">Room Features</h1>
                  <span className="flex items-center gap-2">
                    <Image
                      src="/icons/dot.png"
                      width={100}
                      height={100}
                      className="w-6 h-6"
                      alt="Hotel img"
                    />
                    <p>Room Only</p>
                  </span>
                </div>
                <div className="p-4">
                  <h1 className="text-xl font-semibold">Room Description</h1>
                  <span className="flex items-center gap-2">
                    <Image
                      src="/icons/dot.png"
                      width={100}
                      height={100}
                      className="w-6 h-6"
                      alt="Hotel img"
                    />
                    <p>Shared Dormitory, Multiple Beds (4 Twin Bunk Beds)</p>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {isModalOpenImg && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsModalOpenImg(false)}
        >
          <div
            className="relative bg-white p-4 rounded-lg w-11/12 max-w-4xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-800 text-3xl"
              onClick={() => setIsModalOpen(false)}
            >
            </button>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {standardImages.map((image, index) => (
                <Image
                  key={index}
                  src={image.url}
                  className="w-full h-40 object-cover rounded-lg"
                  width={300}
                  height={200}
                  alt={`Hotel Image ${index + 1}`}
                  unoptimized={true}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    <PriceRateModal
        isOpen={isPriceRateModal}
        onClose={handlePriceCloseModal}
        selectedRoom={selectedRoom}
        hotelDetailsInfo= {hotelDetails}
      />

    </div>
  );
}
