"use client";

import { FacebookIcon, GoogleIcon } from "@/components/icons";
import { Input } from "@/components/ui";
import Button from "@/components/ui/button";
import { apiService } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");

  async function signIn() {
    try {
      const { data } = await apiService.post("user/login", { mobile: `+91${number}` });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex justify-center items-center flex-col gap-2 border rounded-xl my-10 max-w-md mx-auto p-10">
<Image
  src="/logo.png"
  alt="logo"
  width={200}
  height={100}
    objectFit="cover"
/><div className="space-y-2 w-full">
        <p className="text-lgtext-gray-700">Login</p>
        <Input
          type="number"
          placeholder="Enter your phone number"
          onChange={(e) => setNumber(e.target.value)}
        />
      </div>

      <Link className="w-full" href={`/otp?number=+91${number}`}>
        <Button
          className="w-full font-medium py-2 rounded-md transition"
          onClick={signIn}
        >
          CONTINUE
        </Button>
      </Link>

      <div className="flex items-center w-full max-w-xs mt-4">
        <span className="border-t border-gray-300 flex-grow"></span>
        <span className="text-sm text-gray-500 mx-2">Other login option</span>
        <span className="border-t border-gray-300 flex-grow"></span>
      </div>

      <button className="flex items-center gap-2 shadow-sm w-full max-w-xs justify-center bg-white px-6 py-2 rounded-md text-gray-700 mt-2 transition hover:bg-gray-50">
        <GoogleIcon className="w-5 h-5 mr-2" size={25} />
        <span className="text-sm">Login with Google</span>
      </button>

      {/* <button className="flex items-center gap-2 shadow-sm w-full max-w-xs justify-center bg-white px-6 py-2 rounded-md text-gray-700 mt-2 transition hover:bg-gray-50">
        <FacebookIcon className="w-5 h-5 mr-2" size={25} />
        <span className="text-sm">Login with Facebook</span>
      </button> */}
      <p className="text-xs mt-2">
        Dont&apos;t have an account ? <Link href={"/register"}>Register</Link>
      </p>

      <p className="text-xs text-gray-500 text-center mt-2">
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
