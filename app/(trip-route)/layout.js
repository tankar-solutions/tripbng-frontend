"use client";

import { FlightDeals, HolidaySlider, HotelSlider } from "@/components/home";
import Cta from "@/components/home/cta";
import OffersCard from "@/components/home/offers-card";
import Testimonial from "@/components/home/testimonial";
import {
  BusColorIcon,
  BusIcon,
  FlightColorIcon,
  FlightIcon,
  HolidayColorIcon,
  HolidayIcon,
  HotelColorIcon,
  HotelIcon,
  VisaColorIcon,
  VisaIcon,
  YatchIcon,
  YatchlColorIcon,
} from "@/components/icon";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";
import HomeBox from "@/components/HomeBox";

const navItems = [
  {
    title: "Flights",
    url: "/",
    icon: FlightIcon,
    activeIcon: FlightColorIcon,
    image: "/nav/plane.png",
  },
  {
    title: "Hotels",
    // url: "https://ratehawk.prod.zentrumhub.com/",
    url: "/hotel",
    icon: HotelIcon,
    activeIcon: HotelColorIcon,
    image: "/nav/hotel.png",
  },
  {
    title: "Buses",
    url: "/bus",
    icon: BusIcon,
    activeIcon: BusColorIcon,
    image: "/nav/bus.png",
  },
  {
    title: "Holidays",
    url: "/holiday",
    icon: HolidayIcon,
    activeIcon: HolidayColorIcon,
    image: "/nav/holiday.png",
  },
  {
    title: "Visa",
    url: "/visa",
    icon: VisaIcon,
    activeIcon: VisaColorIcon,
    image: "/nav/visa.png",
  },
  // {
  //   title: "Yatch",
  //   url: "/yatch",
  //   icon: YatchIcon,
  //   activeIcon: YatchlColorIcon,
  // },
];
export default function Layout({ children }) {
  const pathname = usePathname();

  // Define dynamic background images for each section
  const heroBackgrounds = {
    "/": "url('/hero-flight.jpg')",
    "/hotel": "url('/hero-hotels.jpg')",
    "/bus": "url('/hero-bus.jpg')",
    "/holiday": "url('/hero-holidays.jpg')",
    "/visa": "url('/hero-visa.jpg')",
    // "/yatch": "url('/hero-yatch.png')", // Uncomment if needed
  };

  const currentBackground =
    heroBackgrounds[pathname] || "url('/default-hero.png')";

  return (
    <>
      <div
        className="hero-image shadow-2xl  hidden md:block"
        style={{
          backgroundImage: currentBackground,
        }}
      >
        <div className="overlay">
          <div className="md:pt-52 pt-24 pb-28 relative  ">
            <div className="container relative ">
              {children}
              <div className="md:max-w-3xl md:mx-auto flex   items-center gap-2 md:gap-10 md:shadow-xl md:bg-white justify-around md:rounded-full  shadow-blue-800 py-2 px-5 md:px-20 absolute -top-16 md:-top-20 left-1/2 transform -translate-x-1/2">
                {navItems.map((item) => {
                  const isActive = pathname === item.url;
                  const Icon = isActive ? item.activeIcon : item.icon;

                  return (
                    <Link href={item.url} key={item.title}>
                      <button
                        className={`flex items-center flex-col bg-white shadow-xl py-2 px-4 rounded-lg  md:bg-transparent md:shadow-none md:py-0 md:px-0 md:rounded-none gap-1 md:gap-2 text-xs md:text-sm ${
                          isActive ? "text-black" : "text-neutral-500"
                        } `}
                      >
                        <Icon className="w-5 h-5 md:w-6 md:h-6" />
                        <span
                          className={`${
                            isActive ? "border-b-2 border-blue-500" : ""
                          }`}
                        >
                          {item.title}
                        </span>
                      </button>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden">
        <HomeBox/>
      </div>

      <Cta />
      <OffersCard />
      <FlightDeals />
      <HotelSlider />
      <HolidaySlider />
      <Testimonial />
    </>
  );
}
