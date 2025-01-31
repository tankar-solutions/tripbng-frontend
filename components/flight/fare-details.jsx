"use client";

import Image from "next/image";
import React from "react";
import { FaTimes } from "react-icons/fa";

export default function FAREDETAILS({ flightData }) {
    return(
        <div
                                    className="fixed inset-0 flex items-center justify-center z-50 bg-black/5"
                                    onClick={closeModal}
                                  >
                                    <div
                                      className="bg-white rounded-xl w-11/12 sm:w-1/1"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <div className="flex justify-between items-center mb-4 p-4 shadow-lg">
                                        <div className="flex items-center gap-2">
                                          <h1 className="text-sm sm:text-lg text-yellow font-semibold">
                                            5 FARE OPTIONS
                                          </h1>
                                          <h2 className="text-sm sm:text-lg font-semibold">
                                            available for your trip.
                                          </h2>
                                        </div>
        
                                        <button
                                          onClick={closeModal}
                                          className="text-gray-600 hover:text-gray-800 p-2 rounded-full"
                                        >
                                          <FaTimes className="w-6 h-6" />
                                        </button>
                                      </div>
                                      <div className="p-4">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <h2 className="text-xs sm:text-sm md:text-base text-gray-600 font-semibold">
                                            New Delhi → Bengaluru
                                          </h2>
                                          <h2 className="text-xs sm:text-sm md:text-base text-gray-600 font-semibold">
                                            Air India · Sat, 21 Dec 24 · Departure at
                                            03:30 - Arrival at 06:20
                                          </h2>
                                        </div>
        
                                        <div className="flex items-center justify-center gap-4 mt-3 overflow-hidden relative">
                                          <div
                                            className="flex transition-transform duration-300 md:p-4 md:gap-3"
                                            style={{
                                              transform: `translateX(calc(-${
                                                currentIndex * (100 / visibleCards)
                                              }% + ${deltaX}px))`,
                                              width: `calc(${cardWidth}% * ${visibleCards})`,
                                            }}
                                            onTouchStart={handleTouchStart}
                                            onTouchMove={handleTouchMove}
                                            onTouchEnd={handleTouchEnd}
                                            onMouseDown={(e) => {
                                              setIsDragging(true);
                                              setStartX(e.clientX);
                                            }}
                                            onMouseMove={(e) => {
                                              if (isDragging) {
                                                setDeltaX(e.clientX - startX);
                                              }
                                            }}
                                            onMouseUp={() => {
                                              setIsDragging(false);
                                              if (deltaX > 50 && currentIndex > 0) {
                                                handlePrev();
                                              } else if (
                                                deltaX < -50 &&
                                                currentIndex <
                                                  cards.length - visibleCards
                                              ) {
                                                handleNext();
                                              }
                                              setDeltaX(0); // Reset deltaX
                                            }}
                                            onMouseLeave={() => setIsDragging(false)}
                                          >
                                            {cards.map((_, index) => (
                                              <div
                                                key={index}
                                                className="flex-shrink-0 border rounded-md shadow-md bg-white"
                                                style={{
                                                  width: `calc(100% / ${visibleCards})`,
                                                }}
                                              >
                                                <div className="p-4">
                                                  <div className="flex items-baseline gap-1">
                                                    <h1 className="text-black text-xl font-semibold">
                                                      ₹10,081
                                                    </h1>
                                                    <p className="text-sm text-gray-500 font-medium">
                                                      per adult
                                                    </p>
                                                  </div>
                                                  <p className="text-sm text-gray-500 font-medium">
                                                    ECO VALUE
                                                  </p>
                                                </div>
                                                <div className="border-b-2"></div>
                                                <div className="p-4">
                                                  <div className="mb-5">
                                                    <h4 className="text-sm font-medium text-black">
                                                      Baggage
                                                    </h4>
                                                    <ul className="mt-2">
                                                      <li className="flex items-center gap-2">
                                                        <Image
                                                          className="w-5"
                                                          src="/icons/mark.png"
                                                          alt=""
                                                        />
                                                        <span className="text-sm font-light text-black">
                                                          7 kg cabin baggage
                                                        </span>
                                                      </li>
                                                      <li className="flex items-center gap-2">
                                                        <Image
                                                          className="w-5"
                                                          src="/icons/mark.png"
                                                          alt="Flight"
                                                        />
                                                        <span className="text-sm font-light text-black">
                                                          15 kg check-in baggage
                                                        </span>
                                                      </li>
                                                    </ul>
                                                  </div>
                                                  <div className="mb-5">
                                                    <h4 className="text-sm font-medium text-black">
                                                      Flexibility
                                                    </h4>
                                                    <ul className="mt-2">
                                                      <li className="flex items-center gap-2">
                                                        <Image
                                                          className="w-5"
                                                          src="/icons/minus.png"
                                                          alt="Flight"
                                                        />
                                                        <span className="text-sm font-light text-black">
                                                          Cancellation fee starts at
                                                          ₹4,000 (up to 2 hours before
                                                          departure)
                                                        </span>
                                                      </li>
                                                      <li className="flex items-center gap-2">
                                                        <Image
                                                          className="w-5"
                                                          src="/icons/minus.png"
                                                          alt="Flight"
                                                        />
                                                        <span className="text-sm font-light text-black">
                                                          Date Change fee starts at
                                                          ₹3,250 up to 2 hrs before
                                                          departure
                                                        </span>
                                                      </li>
                                                    </ul>
                                                  </div>
                                                  <div className="mb-5">
                                                    <h4 className="text-sm font-medium text-black">
                                                      Seats, Meals & More
                                                    </h4>
                                                    <ul className="mt-2">
                                                      <li className="flex items-center gap-2">
                                                        <Image
                                                          className="w-5"
                                                          src="/icons/mark.png"
                                                          alt="Flight"
                                                        />
                                                        <span className="flex text-sm font-medium gap-1">
                                                          <span className="text-yellow">
                                                            Free
                                                          </span>
                                                          <span className="text-blue-500">
                                                            Seats
                                                          </span>
                                                        </span>
                                                      </li>
                                                      <li className="flex items-center gap-2">
                                                        <Image
                                                          className="w-5"
                                                          src="/icons/mark.png"
                                                          alt="Flight"
                                                        />
                                                        <span className="flex text-sm font-medium gap-1">
                                                          <span className="text-yellow">
                                                            Complimentary
                                                          </span>
                                                          <span className="text-blue-500">
                                                            Meals
                                                          </span>
                                                        </span>
                                                      </li>
                                                    </ul>
                                                  </div>
                                                  <div className="flex items-center justify-end gap-2 mt-10">
                                                    <button className="border-2 border-yellow text-yellow font-medium py-1 px-3 rounded-[20px] shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
                                                      Lock Price
                                                    </button>
                                                    <button className="bg-yellow text-white font-medium py-1 px-3 rounded-[20px] shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
                                                      Lock Price
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                          <button
                                            onClick={handlePrev}
                                            className={`absolute top-1/2 left-4 transform -translate-y-1/2 bg-black text-white p-2 rounded-full ${
                                              currentIndex === 0
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                            }`}
                                            disabled={currentIndex === 0}
                                          >
                                            &lt;
                                          </button>
                                          <button
                                            onClick={handleNext}
                                            className={`absolute top-1/2 right-4 transform -translate-y-1/2 bg-black text-white p-2 rounded-full ${
                                              currentIndex >=
                                              cards.length - visibleCards
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                            }`}
                                            disabled={
                                              currentIndex >=
                                              cards.length - visibleCards
                                            }
                                          >
                                            &gt;
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
    )
}