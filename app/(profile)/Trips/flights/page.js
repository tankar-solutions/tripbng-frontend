"use client";
import { FaFilter, FaFilePdf, FaFileExcel, FaDownload } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import dynamic from 'next/dynamic';

import "jspdf-autotable";
const PdfDownload = dynamic(() => import('@/components/PdfDownload'), { ssr: false });

const ITEMS_PER_PAGE = 5;

export default function FlightPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [getAllVisa, setGetAllVisa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const filteredBookings = getAllVisa.filter((booking) =>
    Object.values(booking).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = filteredBookings.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const downloadPDF = (booking) => {
    if (typeof window === "undefined") return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Booking Details", 14, 20);
    doc.setFontSize(12);
    doc.text(`Reference No: ${booking._id}`, 14, 30);
    doc.text(`Booking Date: ${booking.date}`, 14, 40);
    doc.text(`Status: ${booking.status}`, 14, 50);
    doc.text(`Destination: ${booking.destination}`, 14, 60);
    doc.text(`Travel Date: ${booking.date}`, 14, 70);
    doc.text(`Visa Type: ${booking.visaType}`, 14, 80);
    doc.text(`Pax: ${booking.paxType.adult}`, 14, 90);
    doc.save(`${booking._id}_booking_details.pdf`);
    toast.success("PDF downloaded successfully!");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      // This code will only run on the client side
      const mockData = Array.from({ length: 20 }, (_, index) => ({
        _id: `ID${index + 1}`,
        date: `2024-01-${String(index + 1).padStart(2, "0")}`,
        status: index % 2 === 0 ? "Confirmed" : "Pending",
        destination: `Destination ${index + 1}`,
        visaType: index % 2 === 0 ? "Tourist" : "Business",
        paxType: { adult: index + 1 },
      }));

      setTimeout(() => {
        setGetAllVisa(mockData);
        setIsLoadingData(false);
      }, 1000);
    }
  }, []);

  return (
    <div className="container mx-auto py-10 px-4 sm:px-8">
      <div className="flex md:flex-row flex-col items-center justify-between mb-6 gap-2">
        <div className="flex items-center md:w-3/5 w-full">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>
        <div className="flex space-x-2 w-5/5 justify-end">
          <button className="flex items-center px-4 py-2 bg-yellow text-white rounded-md hover:bg-yellow-600">
            <FaFilter className="inline-block mr-2" /> Filter
          </button>
          <button className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
            <FaFilePdf className="mr-2" /> Export PDF
          </button>
          <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
            <FaFileExcel className="mr-2" /> Export Excel
          </button>
        </div>
      </div>

      {isLoadingData ? (
        <div className="space-y-4">
          {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-4 border border-gray-300 rounded-md animate-pulse bg-gray-50"
            >
              <div className="w-20 h-6 bg-gray-300 rounded-md"></div>
              <div className="w-24 h-6 bg-gray-300 rounded-md"></div>
              <div className="w-24 h-6 bg-gray-300 rounded-md"></div>
              <div className="w-24 h-6 bg-gray-300 rounded-md"></div>
              <div className="w-20 h-6 bg-gray-300 rounded-md"></div>
              <div className="w-20 h-6 bg-gray-300 rounded-md"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300 text-sm sm:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Reference No.</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Booking Date</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Destination</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Travel Date</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Visa Type</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Pax</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Download PDF</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((booking, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{booking._id}</td>
                    <td className="border border-gray-300 px-4 py-2">{booking.date}</td>
                    <td className="border border-gray-300 px-4 py-2">{booking.status}</td>
                    <td className="border border-gray-300 px-4 py-2">{booking.destination}</td>
                    <td className="border border-gray-300 px-4 py-2">{booking.date}</td>
                    <td className="border border-gray-300 px-4 py-2">{booking.visaType}</td>
                    <td className="border border-gray-300 px-4 py-2">{booking.paxType.adult}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <PdfDownload booking={booking} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center border border-gray-300 px-4 py-6 text-gray-500"
                  >
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-center items-center mt-6 space-x-2">
        {currentPage > 1 && (
          <button
            className="px-3 py-1 rounded bg-gray-100 text-gray-700"
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Prev
          </button>
        )}
        {Array.from({ length: totalPages }, (_, index) => index + 1)
          .filter(
            (page) =>
              page === 1 || // Always show the first page
              page === totalPages || // Always show the last page
              (page >= currentPage - 1 && page <= currentPage + 1) // Show current, previous, and next pages
          )
          .map((page, index, filteredPages) => (
            <React.Fragment key={page}>
              {index > 0 && page > filteredPages[index - 1] + 1 && (
                <span className="px-3 py-1">...</span>
              )}
              <button
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? "bg-yellow text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            </React.Fragment>
          ))}
        {currentPage < totalPages && (
          <button
            className="px-3 py-1 rounded bg-gray-100 text-gray-700"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
