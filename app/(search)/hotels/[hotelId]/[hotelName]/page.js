"use client";

import axios from "axios";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/button";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronRight } from "lucide-react";

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Extract hotel ID from URL path (assuming /hotels/{hotelId}/{hotelName})
  const pathSegments = pathname.split("/");
  const hotelId = pathSegments[2];

  // Extract search token from query parameters
  const searchToken = searchParams.get("searchid");

  // State variables
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hotelDetails, setHotelDetails] = useState(null);
  const [isModalOpenImg, setIsModalOpenImg] = useState(false);
  // hotelData will hold the complete API response including recommendations, rates, rooms, etc.
  const [hotelData, setHotelData] = useState(null);

  // Get all images with Standard size (if available)
  const standardImages = hotelDetails?.images
    ?.map((img) => img.links.find((link) => link.size === "Standard"))
    ?.filter(Boolean);

  // Function to open/close modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Fetch hotel data on mount
  useEffect(() => {
    if (hotelId && searchToken) {
      getRoomsAndRates(hotelId, searchToken);
      getHotelContent(hotelId);
    }
  }, [hotelId, searchToken]);

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
        // Store the full API response which includes recommendations, rates, rooms, etc.
        setHotelData(response.data);
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

  // Function to map recommendations to their corresponding rate(s) and room(s)
  const mapRecommendationsToDisplayData = () => {
    if (!hotelData || !hotelData.recommendations) return [];
    const { recommendations, rates, standardizedRooms, rooms } = hotelData;

    return recommendations.map((rec) => {
      // Each recommendation object contains an array of rate IDs.
      // For each rate ID, we look up the corresponding rate object.
      const recRates = rec.rates.map((rateId) => {
        const rate = rates.find((r) => r.id === rateId);
        if (rate && rate.occupancies && rate.occupancies.length > 0) {
          let room = null;
          // If standardizedRooms is provided, use stdRoomId from the occupancy
          if (standardizedRooms) {
            const stdRoomId = rate.occupancies[0].stdRoomId;
            room = standardizedRooms.find((r) => r.id === stdRoomId);
          } else {
            // If room mapping service is not opted, use roomId from the occupancy
            const roomId = rate.occupancies[0].roomId;
            room = rooms.find((r) => r.id === roomId);
          }
          return { rate, room };
        }
        return null;
      }).filter(Boolean); // Remove any null entries

      return { recommendation: rec, rates: recRates };
    });
  };

  // Prepare mapped recommendations data for rendering
  const mappedData = mapRecommendationsToDisplayData();

  // Slider settings (if needed)
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    adaptiveHeight: true,
    appendDots: (dots) => (
      <div style={{ marginTop: "-5px" }}>
        <ul style={{ margin: "-20px", padding: "0px" }}>{dots}</ul>
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
            <div class="basis-4/6 bg-blue-200 ">
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
                      unoptimized={true} // ✅ Disables Next.js image optimization
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
                      width={100}
                      height={100}
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
                      width={100}
                      height={100}
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
                      width={100}
                      height={100}
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

          <div className="space-y-4">
          {hotelData ? (
        <div>
          {hotelDetails && <h2>{hotelDetails.name}</h2>}
          {mappedData.length > 0 ? (
            mappedData.map((item) => (
              <div key={item.recommendation.recommendationId} style={{ marginBottom: "20px", borderBottom: "1px solid #eee" }}>
                <h3>Recommendation: {item.recommendation.recommendationId}</h3>
                {item.rates.map((rateItem, idx) => (
                  <div key={idx} style={{ padding: "10px", border: "1px solid #ccc", margin: "10px 0" }}>
                    <p>
                      <strong>Rate ID:</strong> {rateItem.rate.id}
                    </p>
                    <p>
                      <strong>Price:</strong> {rateItem.rate.price}
                    </p>
                    {rateItem.room && (
                      <>
                        <p>
                          <strong>Room Name:</strong> {rateItem.room.name}
                        </p>
                        <p>
                          <strong>Room ID:</strong> {rateItem.room.id}
                        </p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p>No recommendations available.</p>
          )}
        </div>
      ) : (
        <p>Loading hotel data...</p>
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
          onClick={() => setIsModalOpenImg(false)} // Click outside to close
        >
          <div
            className="relative bg-white p-4 rounded-lg w-11/12 max-w-4xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // Prevent closing on click inside
          >
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-800 text-3xl"
              onClick={() => setIsModalOpen(false)}
            >
              {/* <IoClose /> Close Icon */}
            </button>

            {/* Scrollable Image Grid */}
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
    </div>
  );
}
