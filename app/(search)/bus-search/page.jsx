'use client';

import React, { useState } from 'react';

export default function BusDetails() {
  const [visibleSection, setVisibleSection] = useState({});

  const buses = [
    {
      id: 1,
      name: 'Dolphin Travel House',
      type: 'NON A/C Sleeper Coach',
      seatsAvailable: '10 ',
      departure: '16:15',
      arrival: '21:45',
      from: 'Mumbai',
      to: 'Pune',
      distance : '5h 15 m',
      depdate : '16-01-2025',
      arrdate : '17-01-2025',
      price: 'INR 2429',
      cancellation: [
        { time: 'Before 14, Jan 04:15 PM', charges: 'INR 250' },
        { time: 'After 14, Jan 04:15 PM & Before 15, Jan 04:15 PM', charges: 'INR 625' },
        { time: 'After 15, Jan 04:15 PM & Before 16, Jan 04:15 AM', charges: 'INR 750' },
        { time: 'After 16, Jan 04:15 AM & Before 16, Jan 08:15 AM', charges: 'INR 250' },
        { time: 'After 16, Jan 08:15 AM & Before 16, Jan 12:15 PM', charges: 'INR 250' },
      ],
      boardingPoints: ['Location 1 - 08:00 AM', 'Location 2 - 08:30 AM', 'Location 3 - 09:00 AM'],
      droppingPoints: ['Location A - 01:00 PM', 'Location B - 01:30 PM', 'Location C - 02:00 PM'],
    },
    {
    id: 2,
    name: 'Dolphin Travel House',
    type: 'NON A/C Sleeper Coach',
    seatsAvailable: '10 ',
    departure: '16:15',
    arrival: '21:45',
    from: 'Mumbai',
    to: 'Pune',
    distance : '5h 15 m',
    depdate : '16-01-2025',
    arrdate : '17-01-2025',
    price: 'INR 2429',
    cancellation: [
      { time: 'Before 14, Jan 04:15 PM', charges: 'INR 250' },
      { time: 'After 14, Jan 04:15 PM & Before 15, Jan 04:15 PM', charges: 'INR 625' },
      { time: 'After 15, Jan 04:15 PM & Before 16, Jan 04:15 AM', charges: 'INR 750' },
      { time: 'After 16, Jan 04:15 AM & Before 16, Jan 08:15 AM', charges: 'INR 250' },
      { time: 'After 16, Jan 08:15 AM & Before 16, Jan 12:15 PM', charges: 'INR 250' },
    ],
    boardingPoints: ['Location 1 - 08:00 AM', 'Location 2 - 08:30 AM', 'Location 3 - 09:00 AM'],
    droppingPoints: ['Location A - 01:00 PM', 'Location B - 01:30 PM', 'Location C - 02:00 PM'],
  },
    {
      id: 3,
      name: 'Dolphin Travel House',
      type: 'NON A/C Sleeper Coach',
      seatsAvailable: '10 ',
      departure: '16:15',
      arrival: '21:45',
      from: 'Mumbai',
      to: 'Pune',
      distance : '5h 15 m',
      depdate : '16-01-2025',
      arrdate : '17-01-2025',
      price: 'INR 2429',
      cancellation: [
        { time: 'Before 14, Jan 04:15 PM', charges: 'INR 250' },
        { time: 'After 14, Jan 04:15 PM & Before 15, Jan 04:15 PM', charges: 'INR 625' },
        { time: 'After 15, Jan 04:15 PM & Before 16, Jan 04:15 AM', charges: 'INR 750' },
        { time: 'After 16, Jan 04:15 AM & Before 16, Jan 08:15 AM', charges: 'INR 250' },
        { time: 'After 16, Jan 08:15 AM & Before 16, Jan 12:15 PM', charges: 'INR 250' },
      ],
      boardingPoints: ['Location 1 - 08:00 AM', 'Location 2 - 08:30 AM', 'Location 3 - 09:00 AM'],
      droppingPoints: ['Location A - 01:00 PM', 'Location B - 01:30 PM', 'Location C - 02:00 PM'],
    },
    {
      id: 4,
      name: 'Dolphin Travel House',
      type: 'NON A/C Sleeper Coach',
      seatsAvailable: '10 ',
      departure: '16:15',
      arrival: '21:45',
      from: 'Mumbai',
      to: 'Pune',
      distance : '5h 15 m',
      depdate : '16-01-2025',
      arrdate : '17-01-2025',
      price: 'INR 2429',
      cancellation: [
        { time: 'Before 14, Jan 04:15 PM', charges: 'INR 250' },
        { time: 'After 14, Jan 04:15 PM & Before 15, Jan 04:15 PM', charges: 'INR 625' },
        { time: 'After 15, Jan 04:15 PM & Before 16, Jan 04:15 AM', charges: 'INR 750' },
        { time: 'After 16, Jan 04:15 AM & Before 16, Jan 08:15 AM', charges: 'INR 250' },
        { time: 'After 16, Jan 08:15 AM & Before 16, Jan 12:15 PM', charges: 'INR 250' },
      ],
      boardingPoints: ['Location 1 - 08:00 AM', 'Location 2 - 08:30 AM', 'Location 3 - 09:00 AM'],
      droppingPoints: ['Location A - 01:00 PM', 'Location B - 01:30 PM', 'Location C - 02:00 PM'],
    },
    {
      id: 5,
      name: 'Dolphin Travel House',
      type: 'NON A/C Sleeper Coach',
      seatsAvailable: '10 ',
      departure: '16:15',
      arrival: '21:45',
      from: 'Mumbai',
      to: 'Pune',
      distance : '5h 15 m',
      depdate : '16-01-2025',
      arrdate : '17-01-2025',
      price: 'INR 2429',
      cancellation: [
        { time: 'Before 14, Jan 04:15 PM', charges: 'INR 250' },
        { time: 'After 14, Jan 04:15 PM & Before 15, Jan 04:15 PM', charges: 'INR 625' },
        { time: 'After 15, Jan 04:15 PM & Before 16, Jan 04:15 AM', charges: 'INR 750' },
        { time: 'After 16, Jan 04:15 AM & Before 16, Jan 08:15 AM', charges: 'INR 250' },
        { time: 'After 16, Jan 08:15 AM & Before 16, Jan 12:15 PM', charges: 'INR 250' },
      ],
      boardingPoints: ['Location 1 - 08:00 AM', 'Location 2 - 08:30 AM', 'Location 3 - 09:00 AM'],
      droppingPoints: ['Location A - 01:00 PM', 'Location B - 01:30 PM', 'Location C - 02:00 PM'],
    },
    {
      id: 6,
      name: 'Dolphin Travel House',
      type: 'NON A/C Sleeper Coach',
      seatsAvailable: '10 ',
      departure: '16:15',
      arrival: '21:45',
      from: 'Mumbai',
      to: 'Pune',
      distance : '5h 15 m',
      depdate : '16-01-2025',
      arrdate : '17-01-2025',
      price: 'INR 2429',
      cancellation: [
        { time: 'Before 14, Jan 04:15 PM', charges: 'INR 250' },
        { time: 'After 14, Jan 04:15 PM & Before 15, Jan 04:15 PM', charges: 'INR 625' },
        { time: 'After 15, Jan 04:15 PM & Before 16, Jan 04:15 AM', charges: 'INR 750' },
        { time: 'After 16, Jan 04:15 AM & Before 16, Jan 08:15 AM', charges: 'INR 250' },
        { time: 'After 16, Jan 08:15 AM & Before 16, Jan 12:15 PM', charges: 'INR 250' },
      ],
      boardingPoints: ['Location 1 - 08:00 AM', 'Location 2 - 08:30 AM', 'Location 3 - 09:00 AM'],
      droppingPoints: ['Location A - 01:00 PM', 'Location B - 01:30 PM', 'Location C - 02:00 PM'],
    },
    {
      id: 7,
      name: 'Dolphin Travel House',
      type: 'NON A/C Sleeper Coach',
      seatsAvailable: '10 ',
      departure: '16:15',
      arrival: '21:45',
      from: 'Mumbai',
      to: 'Pune',
      distance : '5h 15 m',
      depdate : '16-01-2025',
      arrdate : '17-01-2025',
      price: 'INR 2429',
      cancellation: [
        { time: 'Before 14, Jan 04:15 PM', charges: 'INR 250' },
        { time: 'After 14, Jan 04:15 PM & Before 15, Jan 04:15 PM', charges: 'INR 625' },
        { time: 'After 15, Jan 04:15 PM & Before 16, Jan 04:15 AM', charges: 'INR 750' },
        { time: 'After 16, Jan 04:15 AM & Before 16, Jan 08:15 AM', charges: 'INR 250' },
        { time: 'After 16, Jan 08:15 AM & Before 16, Jan 12:15 PM', charges: 'INR 250' },
      ],
      boardingPoints: ['Location 1 - 08:00 AM', 'Location 2 - 08:30 AM', 'Location 3 - 09:00 AM'],
      droppingPoints: ['Location A - 01:00 PM', 'Location B - 01:30 PM', 'Location C - 02:00 PM'],
    },
    {
      id: 8,
      name: 'Dolphin Travel House',
      type: 'NON A/C Sleeper Coach',
      seatsAvailable: '10 ',
      departure: '16:15',
      arrival: '21:45',
      from: 'Mumbai',
      to: 'Pune',
      distance : '5h 15 m',
      depdate : '16-01-2025',
      arrdate : '17-01-2025',
      price: 'INR 2429',
      cancellation: [
        { time: 'Before 14, Jan 04:15 PM', charges: 'INR 250' },
        { time: 'After 14, Jan 04:15 PM & Before 15, Jan 04:15 PM', charges: 'INR 625' },
        { time: 'After 15, Jan 04:15 PM & Before 16, Jan 04:15 AM', charges: 'INR 750' },
        { time: 'After 16, Jan 04:15 AM & Before 16, Jan 08:15 AM', charges: 'INR 250' },
        { time: 'After 16, Jan 08:15 AM & Before 16, Jan 12:15 PM', charges: 'INR 250' },
      ],
      boardingPoints: ['Location 1 - 08:00 AM', 'Location 2 - 08:30 AM', 'Location 3 - 09:00 AM'],
      droppingPoints: ['Location A - 01:00 PM', 'Location B - 01:30 PM', 'Location C - 02:00 PM'],
    },
  ];

  const clearAllFilters = () => {
    document.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
      checkbox.checked = false;
    });
  };

  const toggleCancellationPolicy = (busId) => {
    setVisibleSection((prev) => ({
      ...prev,
      [busId]: prev[busId] === 'cancellation' ? null : 'cancellation',
    }));
  };

  const toggleBoardingDropping = (busId) => {
    setVisibleSection((prev) => ({
      ...prev,
      [busId]: prev[busId] === 'boardingDropping' ? null : 'boardingDropping',
    }));
  };

  return (
              <div className="bg-white min-h-screen">
          <header className="bg-white text-black p-6 flex justify-center items-center w-full">
              <div  className="grid grid-cols-6 mt-5">
                <div className="border rounded-l-xl p-4">
                  <p className="text-sm">From</p>
                  <p className="text-md font-semibold">New York</p>
                </div>
                <div className="border p-4">
                  <p className="text-sm">To</p>
                  <p className="text-md font-semibold">Los Angeles</p>
                </div>
                <div className="border p-4">
                  <p className="text-sm">Departure</p>
                  <p className="text-md font-semibold">Mon, 15 Jan</p>
                </div>
                <div className="border p-4">
                  <p className="text-sm">Return</p>
                  <p className="text-md font-semibold">-</p>
                </div>
                <div className="border p-4">
                  <p className="text-sm">Travellers & Class</p>
                  <p className="text-md font-semibold">2 Travellers, Economy</p>
                </div>
                <div className="border p-4 rounded-r-xl flex items-center justify-center">
                <button class="border-2 border-yellow bg-yellow text-white px-6 py-2 focus:outline-none rounded-lg w-full lg:w-auto">
                Search
              </button>
                </div>
              </div>
              </header>


              <main className="flex lg:flex-row px-96 h-full">
          <aside className="w-full lg:w-1/5 border border-gray-300 rounded-md p-10 mb-4 lg:mb-0 lg:mr-4 h-full">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">Filters</h3>
            <button
              className="text-yellow text-m font-semibold hover:underline"
              onClick={clearAllFilters}
            >
              Clear All
            </button>
          </div>

          <div className="relative">
            <hr
              className="border-dashed border-gray-300 mb-4"style={{
                position: "absolute",
                left: "0",
                right: "0",
                marginLeft: "-40px",
                marginRight: "-40px",
                top: "50%", 
              }}
            />
          </div><br />


          <div className="mb-6">
            <h4 className="font-semibold mb-2 text-lg">Departure</h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-orange-500 w-4 h-4 border-2 border-gray-400" />
                Before 6AM
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-orange-500 w-4 h-4 border-2 border-gray-400" />
                6AM - 12PM
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-orange-500 w-4 h-4 border-2 border-gray-400" />
                12PM - 6PM
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-orange-500 w-4 h-4 border-2 border-gray-400" />
                After 6PM
              </label>
            </div>
          </div>

          <div className="relative">
            <hr
              className="border-dashed border-gray-300 mb-4"style={{
                position: "absolute",
                left: "0",
                right: "0",
                marginLeft: "-40px",
                marginRight: "-40px",
                top: "50%", 
              }}
            />
          </div><br />



          <div className="mb-6">
            <h4 className="font-semibold mb-2 text-lg">Arrival Time</h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-orange-500 w-4 h-4 border-2 border-gray-400" />
                Before 6AM
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-orange-500 w-4 h-4 border-2 border-gray-400" />
                6AM - 12PM
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-orange-500 w-4 h-4 border-2 border-gray-400" />
                12PM - 6PM
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-orange-500 w-4 h-4 border-2 border-gray-400" />
                After 6PM
              </label>
            </div>
          </div>

          <div className="relative">
            <hr
              className="border-dashed border-gray-300 mb-4"style={{
                position: "absolute",
                left: "0",
                right: "0",
                marginLeft: "-40px",
                marginRight: "-40px",
                top: "50%", 
              }}
            />
          </div><br />



          <div className="mb-6">
            <h4 className="font-semibold mb-2 text-lg">Seat Type</h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-orange-500 w-4 h-4 border-2 border-gray-400" />
                Sleeper
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-orange-500 w-4 h-4 border-2 border-gray-400" />
                Seater
              </label>
            </div>
          </div>
          <div className="relative">
            <hr
              className="border-dashed border-gray-300 mb-4"style={{
                position: "absolute",
                left: "0",
                right: "0",
                marginLeft: "-40px",
                marginRight: "-40px",
                top: "50%", 
              }}
            />
          </div><br />
          <div className="mb-6">
            <h4 className="font-semibold mb-2 text-lg">AC/Non-AC</h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-orange-500 w-4 h-4 border-2 border-gray-400" />
                AC
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-orange-500 w-4 h-4 border-2 border-gray-400  " />
                Non-AC
              </label>
            </div>
          </div>
          <div className="relative">
            <hr
              className="border-dashed border-gray-300 mb-4"style={{
                position: "absolute",
                left: "0",
                right: "0",
                marginLeft: "-40px",
                marginRight: "-40px",
                top: "50%", 
              }}
            />
          </div><br />
          <div className="mb-6">
            <h4 className="font-semibold mb-2 text-lg">Boarding Point</h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-orange-500 w-4 h-4 border-2 border-gray-400" />
              A Chembur - Dimand Gardan 
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-orange-500 w-4 h-4 border-2 border-gray-400" />
                Kharghar Near Hirananadani
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-orange-500 w-4 h-4 border-2 border-gray-400" />
                Vashi,Vashi Plaza Signal
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-orange-500 w-4 h-4 border-2 border-gray-400" />
                vashi:-vashi plaza
              </label>
            </div>
          </div>

          <div className="relative">
            <hr
              className="border-dashed border-gray-300 mb-4"style={{
                position: "absolute",
                left: "0",
                right: "0",
                marginLeft: "-40px",
                marginRight: "-40px",
                top: "50%", 
              }}
            />
          </div><br />

          <div className="mb-6">
            <h4 className="font-semibold mb-2 text-lg">Dropping Point</h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-orange-500 w-4 h-4 border-2 border-gray-400" />
              7 Loves Chowk 
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-orange-500 w-4 h-4 border-2 border-gray-400" />
                Aundh (Near opp police chowki)
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-orange-500 w-4 h-4 border-2 border-gray-400" />
                Aundh-Bramna Chouk
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-orange-500 w-4 h-4 border-2 border-gray-400" />
                Aundh-Bremen Chowk
              </label>
            </div>
          </div>

          <div className="relative">
            <hr
              className="border-dashed border-gray-300 mb-4"style={{
                position: "absolute",
                left: "0",
                right: "0",
                marginLeft: "-40px",
                marginRight: "-40px",
                top: "50%", 
              }}
            />
          </div><br />

          <div className="mb-6">
            <h4 className="font-semibold mb-2 text-lg">Bus Operator</h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-orange-500 w-4 h-4 border-2 border-gray-400" />
                Agroplus Krushi Samrat PVT LTD
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-orange-500 w-4 h-4 border-2 border-gray-400" />
                Ajara Travels
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-orange-500 w-4 h-4 border-2 border-gray-400" />
                Anand Travels
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-orange-500 w-4 h-4 border-2 border-gray-400" />
                Dolphin Travel House
              </label>
            </div>
          </div>


        </aside>

        {/* Bus List Section */}
        <div className="w-full lg:w-3/4 ">
          {buses.map((bus) => (
            <div key={bus.id} className="border border-gray-300 rounded-md p-10 flex flex-col w-[90%] mx-auto mb-4 shadow-sm">
              <div className="flex items-center">
                <div className="flex flex-col w-1/4">
                  <h4 className="font-semibold text-2xl">{bus.name}</h4>
                  <p className="text-sm text-gray-600">{bus.type}</p>
                  <p className="text-sm text-gray-600">{bus.seatsAvailable} Seats Available</p>
                </div>

                <div className="flex items-center justify-between w-2/4 px-4">
                  <div className="text-center">
                    <p className="text-gray-500 text-m">{bus.from}</p>
                    <p className="text-black font-bold text-lg">{bus.departure}</p>
                    <p className="text-gray-500 text-m">{bus.depdate}</p>
                  </div>

                  <div className="relative flex-grow mx-4">
                    <div className="border-dashed border-gray-300 border-t h-0"></div>
                    <p className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-black text-sm">
                     {bus.distance}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-gray-500 text-m">{bus.to}</p>
                    <p className="text-black font-bold text-lg">{bus.arrival}</p>
                    <p className="text-gray-500 text-m">{bus.arrdate}</p>
                  </div>
                </div>

                <div className="w-1/4 text-right">
                  <p className="text-xl font-bold ">{bus.price}</p>
                  <button className="bg-yellow text-white px-6 py-2 rounded-md mt-2 ">
                    SELECT SEAT
                  </button>
                </div>
              </div><br/>

              <div className="mt-8 flex justify-end space-x-6 border-t border-gray-300 pt-4 text-m text-yellow">
                <a
                  href="#"
                  className="hover:underline"
                  onClick={() => toggleCancellationPolicy(bus.id)}
                >
                  Cancellation Policies
                </a>
                <span className="px-2">|</span>
                <a
                  href="#"
                  className="hover:underline"
                  onClick={() => toggleBoardingDropping(bus.id)}
                >
                  Boarding & Dropping Points
                </a>
              </div>

              {visibleSection[bus.id] === 'cancellation' && (
                <div className="mt-4 text-black text-lg">
                  <table className="w-full table-auto border-collapse">
                    <thead>
                      <tr>
                        <th className="border-b px-4 py-2 text-left">Cancellation Time</th>
                        <th className="border-b px-4 py-2 text-center">Cancellation Charges</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bus.cancellation.map((policy, index) => (
                        <tr key={index}>
                          <td className="border-b px-4 py-4">{policy.time}</td>
                          <td className="border-b px-4 py-4 bg-gray-100 text-black text-center">
                            {policy.charges}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {visibleSection[bus.id] === 'boardingDropping' && (
                <div className="mt-4 text-black text-lg">
                  <div className="flex space-x-8">
                    <div className="w-1/2 p-4 border border-gray-300 rounded-md ">
                      <h4 className="font-semibold mb-2">Boarding Points</h4>
                      <ul className="space-y-2">
                        {bus.boardingPoints.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="w-1/2 p-4 border border-gray-300 rounded-md">
                      <h4 className="font-semibold mb-2">Dropping Points</h4>
                      <ul className="space-y-2">
                        {bus.droppingPoints.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
