import React from "react";
import { FooterIcons } from "../icons";
import Link from "next/link";
import { FooterData } from "@/constants/data";
import Image from "next/image";

export default function Footer() {
  return (
    <>
      <footer className="bg-black py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="flex max-lg:flex-col justify-between items-start max-lg:items-start gap-10">
            {/* Logo and Icons Section */}
            <div className="flex flex-col max-md:items-start items-center justify-center w-full lg:w-auto gap-6">
              <Image src="/logo.png" width={100} height={100} alt="footer-logo" className="w-40 h-auto" />
              <div className="flex gap-4 flex-wrap justify-center lg:justify-start">
                {FooterIcons.map((icon, i) => (
                  <a
                    href={icon.url}
                    key={i}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-black rounded-full p-2 hover:bg-gray-200 transition-colors"
                  >
                    {icon.icon}
                  </a>
                ))}
              </div>
            </div>
            {/* Footer Links Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-md:ml-0 max-lg:mx-auto">
              <div className="lg:text-left">
                <h3 className="font-semibold mb-3">
                  {FooterData.travelTourism.title}
                </h3>
                <ul>
                  {FooterData.travelTourism.links.map((link, i) => (
                    <li
                      key={i}
                      className="mb-2 list-disc list-inside text-neutral-400"
                    >
                      <Link href={link.url}>{link.text}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-left flex flex-col items-start">
                <h3 className="font-semibold mb-3">
                  {FooterData.services.title}
                </h3>
                <ul className="flex items-start flex-col">
                  {FooterData.services.links.map((link, i) => (
                    <li key={i} className="mb-2 text-neutral-400">
                      <Link href={link.url} className="flex items-center gap-3">
                        <Image
                          src={link.icon}
                          width={18}
                          height={18}
                          alt={link.text}
                        />
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-left">
                <h3 className="font-semibold mb-3">
                  {FooterData.supportHelp.title}
                </h3>
                <ul>
                  {FooterData.supportHelp.links.map((link, i) => (
                    <li
                      key={i}
                      className="mb-2 list-disc list-inside text-neutral-400"
                    >
                      <Link href={link.url}>{link.text}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
        <div className="mt-4 text-sm text-neutral-400">
          © Copyright {new Date().getFullYear()}
        </div>
    </>
  );
}
