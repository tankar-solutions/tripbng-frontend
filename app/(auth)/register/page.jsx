"use client";

import { FacebookIcon, GoogleIcon } from "@/components/icons";
import { Input } from "@/components/ui";
import Button from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Register() {
  return (
    <div className="flex justify-center items-center flex-col gap-2 border rounded-xl my-10 max-w-md mx-auto p-10">
      <Image src={"/logo.png"} width={140} height={100} alt="logo" />
      <div className="space-y-2 w-full">
        <p className="text-lgtext-gray-700">Name</p>
        <Input type="text" placeholder="Enter your name" />
      </div>
      <div className="space-y-2 w-full">
        <p className="text-lgtext-gray-700">Number</p>
        <Input type="number" placeholder="Enter your phone number" />
      </div>
      <div className="space-y-2 w-full">
        <p className="text-lgtext-gray-700">Email</p>
        <Input type="email" placeholder="Enter your email" />
      </div>
      <div className="space-y-2 w-full">
        <p className="text-lgtext-gray-700">Password</p>
        <Input type="password" placeholder="Enter your password" />
      </div>

      <Button className="w-full font-medium py-2 rounded-md transition">
        CONTINUE
      </Button>

      <div className="flex items-center w-full max-w-xs mt-4">
        <span className="border-t border-gray-300 flex-grow"></span>
        <span className="text-sm text-gray-500 mx-2">Other signup option</span>
        <span className="border-t border-gray-300 flex-grow"></span>
      </div>

      <button className="flex items-center gap-2 shadow-sm w-full max-w-xs justify-center bg-white px-6 py-2 rounded-md text-gray-700 mt-2 transition hover:bg-gray-50">
        <GoogleIcon className="w-5 h-5 mr-2" size={25} />
        <span className="text-sm">Signup with Google</span>
      </button>

      {/* <button className="flex items-center gap-2 shadow-sm w-full max-w-xs justify-center bg-white px-6 py-2 rounded-md text-gray-700 mt-2 transition hover:bg-gray-50">
        <FacebookIcon className="w-5 h-5 mr-2" size={25} />
        <span className="text-sm">Signup with Facebook</span>
      </button> */}

      <p className="text-xs mt-2">
        Already have an account ? <Link href={"/login"}>login</Link>
      </p>

      <p className="text-xs text-gray-500 text-center mt-6">
        By proceeding, you agree to our{" "}
        <Link href="/term-and-condition" className="underline text-blue">
          T&C
        </Link>{" "}
        and{" "}
        <Link href="/privacy-policy" className="underline text-blue">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}
