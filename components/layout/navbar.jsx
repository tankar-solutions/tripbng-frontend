"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { HamburgerMenuIcon, Cross2Icon } from "@radix-ui/react-icons";
import { FaUser, FaChevronDown } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");


    if (token && storedUser) {
      setUser(JSON.parse(storedUser)); 
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null); 
    router.push("/");
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const ProfileMenu = () => (
    <Select>
      <SelectTrigger>
        <SelectValue
          placeholder={
            <span className="text-sm flex items-center gap-3">
              <span className="bg-green-500 text-white font-semibold h-7 w-7 text-center rounded-full flex items-center justify-center">
                H
              </span>
              <span className="font-semibold text-lg">Hi, Hetuk</span>
              <FaChevronDown className="text-gray-600" />
            </span>
          }
        />
      </SelectTrigger>
      <SelectContent className="bg-white p-4 shadow-lg rounded-md max-w-sm">
        <div>
          <Link href="/Account">
            <div className="flex items-center p-2 rounded-lg mt-2 cursor-pointer">
              <span className="w-10 h-6 overflow-hidden">
                <Image src="/icons/accountUser.png" width={16} height={16} alt="Profile Icon" />
              </span>
              <h3 className="font-semibold text-sm">My Profile</h3>
            </div>
          </Link>
          <Link href="/Bookings">
            <div className="flex items-center p-2 rounded-lg">
              <span className="w-10 h-6 overflow-hidden">
                <Image src="/icons/accountTrip.png" width={16} height={16} alt="Trips Icon" />
              </span>
              <h3 className="font-semibold text-sm">My Trips</h3>
            </div>
          </Link>
          <Link href="/Wallet">
            <div className="flex items-center p-2 rounded-lg">
              <span className="w-10 h-6 overflow-hidden">
                <Image src="/icons/accountWallet.png" width={16} height={16} alt="Wallet Icon" />
              </span>
              <h3 className="font-semibold text-sm">My Wallet</h3>
            </div>
          </Link>
          <button
            className="rounded-md bg-red-500 text-white p-2 mt-2"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </SelectContent>
    </Select>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl shadow-lg">
      <div className="container flex justify-between items-center py-6">
        {/* Logo */}
        <Link href={"/"}>
          <Image src={"/logo.png"} width={150} height={150} alt="logo" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4 items-center">
          {/* <Button className={"rounded-md"}>AI Assistance</Button> */}
          {user ? (
            <div className="flex items-center space-x-4">
              <Select>
                <SelectTrigger className="">
                  <SelectValue
                    placeholder={
                      <span className="text-sm text-gray-700 flex items-center gap-3">
                        {/* <span>{user.mobile && <FaUser className="inline mr-2 text-gray-600 h-5 w-5" />}</span>
              <span>{user.mobile}</span> */}

                        <span className="gap-1 flex items-center">
                          <span className="bg-green-500 text-white font-semibold h-7 w-7 text-center rounded-full flex items-center justify-center">
                            H
                          </span>
                          <span className="font-semibold text-lg">
                            Hi, {user?.name}
                          </span>
                        </span>
                        <span>
                          <FaChevronDown className="inline mr-2 text-gray-600" />
                        </span>
                      </span>
                    }
                  />
                </SelectTrigger>
                <SelectContent className="bg-white p-4 shadow-lg rounded-md max-w-sm">
                  <div>
                    <p className="text-sm">
                      You are viewing your personal profile
                    </p>
                    <Link href="/Account">
                      <div className="flex items-center  p-2 rounded-lg mt-2 cursor-pointer">
                        <span className="w-10 h-6 overflow-hidden">
                          <Image
                            src="/icons/accountUser.png"
                            alt="Profile Icon"
                            width={16}
                            height={16}
                            className="w-5 h-5 object-cover"
                          />
                        </span>
                        <span>
                          <h3 className="font-semibold text-sm">My Profile</h3>
                        </span>
                      </div>
                    </Link>

                    <Link href="/Trips">
                      <div className="flex items-center p-2 rounded-lg">
                        <span className="w-10 h-6 overflow-hidden">
                          <Image
                            src="/icons/accountTrip.png"
                            alt="Trips Icon"
                            width={16}
                            height={16}
                            className="w-5 h-5"
                          />
                        </span>
                        <span>
                          <h3 className="font-semibold text-sm">My Trips</h3>
                        </span>
                      </div>
                    </Link>
                    <Link href="/Wallet">
                      <div className="flex items-center p-2 rounded-lg">
                        <span className="w-10 h-6 overflow-hidden">
                          <Image
                            src="/icons/accountWallet.png"
                            alt="Trips Icon"
                            className="w-5 h-5"
                            width={10}
                            height={10}
                          />
                        </span>
                        <span>
                          <span className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm">My Wallet</h3>
                            <span className="bg-green-400 px-2 rounded-lg text-sm font-semibold text-white">
                              ₹ 0
                            </span>
                          </span>
                        </span>
                      </div>
                    </Link>
                    <button className={"rounded-md"} onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <Link href="/login">
              <button className="rounded-md bg-blue-500 text-white p-2">
                Login or Signup
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button className="md:hidden" onClick={toggleDrawer}>
          {!isDrawerOpen ? <HamburgerMenuIcon className="w-6 h-6" /> : null}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <div className="fixed top-0 right-0 w-4/5 bg-white shadow-lg z-50 p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button onClick={toggleDrawer}>
              <Cross2Icon className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {user ? (
              <>
                <ProfileMenu />
                <button
                  className="rounded-md bg-red-500 text-white p-2"
                  onClick={() => {
                    handleLogout();
                    toggleDrawer();
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login">
                <button
                  className="w-full rounded-md bg-blue-500 text-white p-2"
                  onClick={toggleDrawer}
                >
                  Login or Signup
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
