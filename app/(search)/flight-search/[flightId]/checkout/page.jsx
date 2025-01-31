"use client";
import { FlightVector } from "@/components/icons";
import Simmer from "@/components/layout/simmer";
import { Input } from "@/components/ui";
import Checkbox from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiService } from "@/lib/api";
import axios from "axios";
import { Clock, MoveRight } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaBaggageClaim, FaTimes, FaEdit } from "react-icons/fa";
export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [flightData, setFlightData] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [repriceData, setRepriceData] = useState([]);
  const [searchKey, setSearchKey] = useState([]);
  const [isGSTChecked, setIsGSTChecked] = useState(false);
  const [paxDetails, setPaxDetails] = useState([]);
  const [seatsData, setSeatsData] = useState([]);
  const [travelerCounts, setTravelerCounts] = useState({
    a: 0,
    c: 0,
    i: 0,
    tp: 0,
  });
  const [checkedTravelers, setCheckedTravelers] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(true);
  const [seatsMeals, setSeatsMeals] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [refNum, setRefNum] = useState();
  const [countryCode, setCountryCode] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
console.log(email, mobileNumber, countryCode);

  const [currentCounts, setCurrentCounts] = useState({
    adults: 0,
    children: 0,
    infants: 0,
  });

  const mapKey = {
    adults: "Adult_Count",
    children: "Child_Count",
    infants: "Infant_Count",
  };
  const totalTravelers = travelerCounts.a + travelerCounts.c + travelerCounts.i;
  
  const handleSelectSeat = (seat) => {
    if (seat.SSR_Status !== 1) return;

    setSelectedSeats((prevSelectedSeats) => {
      if (prevSelectedSeats.some((item) => item.SSR_Key === seat.SSR_Key)) {
        return prevSelectedSeats.filter(
          (item) => item.SSR_Key !== seat.SSR_Key
        );
      } else if (prevSelectedSeats.length < totalTravelers) {
        return [...prevSelectedSeats, { SSR_Key: seat.SSR_Key }];
      }
      return prevSelectedSeats;
    });
  };

  // Validate individual field
  const validateField = (id, field, value) => {
    if (!value || value.trim() === "") {
      setErrors((prev) => ({
        ...prev,
        [id]: { ...prev[id], [field]: `${field} is required` },
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [id]: { ...prev[id], [field]: undefined },
      }));
    }
  };

  // Validate all fields for a traveler
  const validateTraveler = (traveler) => {
    const newErrors = {};
    if (!traveler.Title || traveler.Title.trim() === "") {
      newErrors.Title = "Title is required";
    }
    if (!traveler.First_Name || traveler.First_Name.trim() === "") {
      newErrors.First_Name = "First Name is required";
    }
    if (!traveler.Last_Name || traveler.Last_Name.trim() === "") {
      newErrors.Last_Name = "Last Name is required";
    }
    if (!traveler.Gender || traveler.Gender.trim() === "") {
      newErrors.Gender = "Gender is required";
    }
    return newErrors;
  };

  const counts = paxDetails.reduce(
    (acc, item) => {
      if (item.Pax_type === 0) acc.adults += 1;
      if (item.Pax_type === 1) acc.children += 1;
      if (item.Pax_type === 2) acc.infants += 1;
      return acc;
    },
    { adults: 0, children: 0, infants: 0 }
  );

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle checkbox change for each traveler
  const handleCheckboxChange = (travelerId) => {
    setCheckedTravelers((prev) => ({
      ...prev,
      [travelerId]: !prev[travelerId],
    }));
  };
  const handleCheckboxChangeGst = () => {
    setIsGSTChecked((prev) => !prev);
  };

  // console.log("repriceData", repriceData.data?.AirRepriceResponses[0].Flight);
  console.log(
    "data",
    repriceData.data?.AirRepriceResponses[0].Flight?.Flight_Key
  );

  const fareTypeMapping = {
    0: "RetailFare",
    1: "CouponFare",
    2: "CorporateFare",
    3: "SMEFare",
    4: "RTSPLFare",
    5: "DealFare",
  };

  useEffect(() => {
    const encodedFlightData = searchParams.get("flightData");
    const index = searchParams.get("selectedIndex");
    const searchkeyEnc = JSON.parse(localStorage.getItem("searchKey"));
    const travelCount = searchParams.get("travelCount");

    if (encodedFlightData) {
      setFlightData(JSON.parse(decodeURIComponent(encodedFlightData)));
    }

    setSearchKey(searchkeyEnc);
    setSelectedIndex(index === "undefined" || index === "" ? 0 : index);
  }, [searchParams]);

  useEffect(() => {
    const storedTravelerCounts = localStorage.getItem("travelerCounts");

    if (storedTravelerCounts) {
      setTravelerCounts(JSON.parse(storedTravelerCounts));
    }
  }, []);

  // Api Integration

  
  const respriceRequirements = useCallback(async () => {
    const flightKeys = flightData?.Flight_Key;
    const fareId = flightData?.Fares[0]?.Fare_Id;
    const searchKeyItem = searchKey.toString();
    
    if (!flightKeys && !fareId && !searchKeyItem) {
      console.error("Flight data or Flight_Key is missing.");
      return;
    }
  
    try {
      setLoading(true);
      const response = await apiService.post("/flight/reprice", {
        Search_Key: searchKeyItem,
        AirRepriceRequests: [
          {
            Flight_Key: flightKeys,
            Fare_Id: fareId,
          },
        ],
        Customer_Mobile: "9173456988",
        GST_Input: true,
      });
      setRepriceData(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching flight data:", error);
      setError("Failed to fetch flight data");
      setLoading(false);
    }
  }, [flightData, searchKey]);
  useEffect(() => {
    if (searchKey) {
      respriceRequirements();
    }
  }, [searchKey, respriceRequirements]);

  const seatSelect = async () => {
    const searchKeyItem = searchKey.toString();
    if (!searchKeyItem) {
      console.error("Flight data or Flight_Key is missing.");
      return;
    }
    try {
      setLoading(true);
      const response = await apiService.post("/flight/seats", {
        Search_Key: searchKeyItem,
        Flight_Keys: [
          repriceData.data?.AirRepriceResponses[0].Flight?.Flight_Key,
        ],
        PAX_Details: paxDetails,
      });
      setSeatsData(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching flight seats data:", error);
      setError("Failed to fetch flight seats data");
      setLoading(false);
    }
  };

  const travelDetails = {
    Adult_Count: travelerCounts.a,
    Child_Count: travelerCounts.c,
    Infant_Count: travelerCounts.i,
  };

  const tempBooking = async () => {
    const searchKeyItem = searchKey.toString();
    if (!searchKeyItem) {
      console.error("Flight data or Flight_Key is missing.");
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.post("/flight/tempBooking", {
        Customer_Mobile: "6789828347",
        Passenger_Mobile: "6789828347",
        Passenger_Email: "demo@outlook.com",
        PAX_Details: paxDetails,
        GST: false,
        GST_Number: "",
        GST_HolderName: "GST Holder Name",
        GST_Address: "GST Address",
        BookingFlightDetails: [
          {
            Search_Key: searchKeyItem,
            Flight_Key:
              repriceData.data?.AirRepriceResponses[0].Flight?.Flight_Key,
            BookingSSRDetails: selectedSeats,
          },
        ],
        BookingRemark: "MAA-TCR  18-Oct-2021  Test API With GST",
      });
      console.log("res", response.data.Booking_RefNo);
      console.log("res", response.data.Response_Header.Error_Desc);
      setLoading(false);
      if (response.data.Response_Header.Error_Desc == "SUCCESS") {
        setRefNum(response.data.Booking_RefNo);
      } else {
        toast.error(response.data.Response_Header.Error_Desc);
      }
    } catch (error) {
      console.error("Error fetching flight data:", error);
      setError("Failed to fetch flight data");
      setLoading(false);
    }
  };

  const makePayment = useCallback(async () => {
    try {
      // Send the payment request to your API
      const response = await apiService.post("/user/makePayment", {
        email: "hp@gmail.com",
        name: "hetuk",
        phone: "7203954483",
        refNo: refNum,
        type: 0,
        amount:
          repriceData.data?.AirRepriceResponses[0].Flight.Fares[0]
            .FareDetails[0].Total_Amount,
      });
  
      if (response.success) {
        console.log("Payment successful:", response.data);
  
        // Prepare PayU parameters
        const payuParams = {
          key: response.data.key,
          txnid: response.data.txnid,
          amount: response.data.amount,
          firstname: response.data.firstname,
          email: response.data.email,
          phone: response.data.phone,
          productinfo: response.data.productinfo,
          surl: response.data.surl, // Success URL
          furl: response.data.furl, // Failure URL
          hash: response.data.hash,
        };
  
        // Redirect to PayU test API for payment
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://test.payu.in/_payment";
  
        Object.keys(payuParams).forEach((key) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = payuParams[key];
          form.appendChild(input);
        });
  
        document.body.appendChild(form);
        form.submit(); // Submit the form to PayU
      } else {
        toast.error("Payment failed:", response.data);
      }
    } catch (error) {
      console.error("Error making payment:", error.message);
    }
  }, [refNum, repriceData]);
  useEffect(() => {
    if (refNum) {
      makePayment();
    }
  }, [refNum, makePayment]);
  const addTraveler = (type) => {
    const maxCount = travelDetails[mapKey[type]];
    setCurrentCounts((prev) => ({
      ...prev,
      [type]: Math.min(prev[type] + 1, maxCount),
    }));

    // Add a new traveler object with default values to paxDetails
    setPaxDetails((prev) => [
      ...prev,
      {
        Pax_Id: prev.length + 1,
        Pax_type: type === "adults" ? 0 : type === "children" ? 1 : 2,
        Title: "",
        First_Name: "",
        Last_Name: "",
        Gender: "",
        Age: null,
        DOB: null,
        Passport_Number: null,
        Passport_Issuing_Country: null,
        Passport_Expiry: null,
        Nationality: null,
        Pancard_Number: null,
        FrequentFlyerDetails: null,
      },
    ]);
  };

  const updateTraveler = (id, field, value) => {
    setPaxDetails((prev) =>
      prev.map((traveler) =>
        traveler.Pax_Id === id ? { ...traveler, [field]: value } : traveler
      )
    );
  };

  const handleSubmit = () => {
    let hasError = false;
    const newErrors = {};
    setError(null);

    paxDetails.forEach((traveler) => {
      const travelerErrors = validateTraveler(traveler);
      if (Object.keys(travelerErrors).length > 0) {
        hasError = true;
        newErrors[traveler.Pax_Id] = travelerErrors;
      }
    });

    const allChecked = paxDetails.every(
      (traveler) => checkedTravelers[traveler.Pax_Id]
    );
    const totalChecked = Object.values(checkedTravelers).filter(Boolean).length;

    setErrors(newErrors);

    if (
      !hasError &&
      allChecked &&
      totalChecked === travelerCounts.a + travelerCounts.c + travelerCounts.i
    ) {
      console.log("Form submitted successfully!");
      openModal();
      // Proceed with form submission logic
    } else {
      if (!allChecked) {
        console.log("Not all travelers are checked.");
        setError("Kindly add all travellers before proceeding");
      } else {
        console.log("Validation errors or missing checks.");
        setError("Kindly add all travellers before proceeding");
      }
    }

    console.log("Submitted Data:", paxDetails);
  };

  const handleConfirm = () => {
    setUserDetails(false);
    setSeatsMeals(true);
    seatSelect();
  };
  const handleSeatsMeals = () => {
    setSeatsMeals(false);
    setIsModalOpen(false);
  };
  const handleTempBooking = () => {
    tempBooking();
  };
  const renderForms = (type, label) => {
    const count = currentCounts[type];
    const maxCount = travelDetails[mapKey[type]];

    return (
      <>
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-sm">{`${count}/${maxCount} ${label}`}</p>
        </div>
        <button
          className="px-4 py-2 bg-blue-500 text-yellow rounded-md mt-2"
          onClick={() => addTraveler(type)}
          disabled={count >= maxCount}
        >
          + Add {label}
        </button>
        {paxDetails
          .filter(
            (traveler) =>
              traveler.Pax_type ===
              (type === "adults" ? 0 : type === "children" ? 1 : 2)
          )
          .map((traveler, index) => (
            <div
              key={traveler.Pax_Id}
              className="shadow-lg p-4 rounded-lg mb-4"
            >
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={checkedTravelers[traveler.Pax_Id] || false}
                    onChange={() => handleCheckboxChange(traveler.Pax_Id)}
                    className="mr-2 w-4 h-4"
                  />
                  <h3>
                    {type === "adults"
                      ? `Adult ${index + 1}`
                      : type === "children"
                      ? `Child ${index + 1}`
                      : `Infant ${index + 1}`}
                  </h3>
                </label>
              </div>

              {/* Conditionally render form fields based on checkbox state */}
              {checkedTravelers[traveler.Pax_Id] && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-4">
                  <div>
                    <Input
                      placeholder="Title (Mr/Ms)"
                      value={traveler.Title}
                      onChange={(e) => {
                        const value = e.target.value;
                        updateTraveler(traveler.Pax_Id, "Title", value);
                        validateField(traveler.Pax_Id, "Title", value);
                      }}
                    />
                    {errors[traveler.Pax_Id]?.Title && (
                      <p className="text-red-500 text-sm">
                        {errors[traveler.Pax_Id].Title}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      placeholder="First Name"
                      value={traveler.First_Name}
                      onChange={(e) => {
                        const value = e.target.value;
                        updateTraveler(traveler.Pax_Id, "First_Name", value);
                        validateField(traveler.Pax_Id, "First_Name", value);
                      }}
                    />
                    {errors[traveler.Pax_Id]?.First_Name && (
                      <p className="text-red-500 text-sm">
                        {errors[traveler.Pax_Id].First_Name}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      placeholder="Last Name"
                      value={traveler.Last_Name}
                      onChange={(e) => {
                        const value = e.target.value;
                        updateTraveler(traveler.Pax_Id, "Last_Name", value);
                        validateField(traveler.Pax_Id, "Last_Name", value);
                      }}
                    />
                    {errors[traveler.Pax_Id]?.Last_Name && (
                      <p className="text-red-500 text-sm">
                        {errors[traveler.Pax_Id].Last_Name}
                      </p>
                    )}
                  </div>
                  <div>
                    <Select
                      value={String(traveler.Gender)} // Ensure the value is a string for comparison
                      onValueChange={(value) => {
                        updateTraveler(traveler.Pax_Id, "Gender", value);
                        validateField(traveler.Pax_Id, "Gender", value);
                      }}
                      className="w-full p-2 border rounded-lg"
                    >
                      <SelectTrigger className="flex h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 shadow-sm text-gray-500  text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow disabled:cursor-not-allowed disabled:opacity-50">
                        <SelectValue placeholder="Select Gender" className="" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Male</SelectItem>
                        <SelectItem value="1">Female</SelectItem>
                      </SelectContent>
                    </Select>

                    {errors[traveler.Pax_Id]?.Gender && (
                      <p className="text-red-500 text-sm">
                        {errors[traveler.Pax_Id].Gender}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={traveler.DOB || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        const [year, month, day] = value.split("-"); // YYYY-MM-DD
                        const formattedDate = `${month}/${day}/${year}`; // Convert to DD/MM/YYYY
                        updateTraveler(traveler.Pax_Id, "DOB", formattedDate);
                        validateField(traveler.Pax_Id, "DOB", formattedDate);
                      }}
                      className="w-full p-2 border rounded-lg"
                      max={new Date().toISOString().split("T")[0]} // Restrict future dates
                      placeholder="Select Date of Birth"
                    />
                    {errors[traveler.Pax_Id]?.DOB && (
                      <p className="text-red-500 text-sm">
                        {errors[traveler.Pax_Id].DOB}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
      </>
    );
  };

  const renderTravelerDetails = (traveler, index, type) => (
    <div
      key={traveler.Pax_Id}
      className="bg-white shadow-lg rounded-lg p-4 border-2 mt-4"
    >
      <h1>{`${type} ${index + 1}`}</h1>
      <div className="mt-2 w-1/2">
        <span className="flex items-center justify-between">
          <p className="text-gray-500">First & Middle Name</p>
          <p className="text-left w-5">{traveler.First_Name}</p>
        </span>
        <span className="flex items-center justify-between mt-2">
          <p className="text-gray-500">Last Name</p>
          <p className="text-left w-5">{traveler.Last_Name}</p>
        </span>
        <span className="flex items-center justify-between mt-2">
          <p className="text-gray-500">Gender</p>
          <p className="text-left w-5">
            {traveler.Gender === 0 ? "Male" : "Female"}
          </p>
        </span>
      </div>
    </div>
  );

  // Generate the seat map based on the seat data
  const renderSeats = (seatRow) => {
    return seatRow.map((seat) => {
      const isSelected = selectedSeats.some(
        (selectedSeat) => selectedSeat.SSR_Key === seat.SSR_Key
      );

      let seatClass = "";
      switch (seat.SSR_Status) {
        case 0:
          seatClass = "bg-white";
          break;
        case 1: // Available
          seatClass = isSelected ? "bg-yellow text-white" : "bg-[#89CFF0]";
          break;
        case 2:
          seatClass = "bg-[#A1A1A1]";
          break;
        case 3:
          seatClass = "bg-[#FF6B6B]";
          break;
        default:
          seatClass = "bg-white";
      }

      return (
        <div
          key={seat.SSR_Key}
          onClick={() => handleSelectSeat(seat)}
          className={`seat w-10 h-10 flex items-center justify-center cursor-pointer rounded-sm transition-all ${seatClass}`}
        >
          <p className="text-sm">{seat.SSR_TypeName}</p>{" "}
          {/* Reduced font size */}
        </div>
      );
    });
  };

  if (!flightData) {
    return <Simmer />;
  }
  return (
    <div className="md:container mx-3 grid grid-cols-1 md:grid-cols-[70%_30%] gap-6 md:gap-10 py-8">
      {/* Left Section (Flight Details) */}
      <div className="space-y-6">
        <div className="mt-4 border rounded-xl border-dashed p-6 grid grid-cols-1 md:grid-cols-1 gap-6 bg-white">
          {/* Flight Info */}
          <div>
            <div>
              <div className="flex items-center gap-3">
                <h4>{flightData.Segments[0].Origin_City}</h4>
                <MoveRight />
                <h4>
                  {flightData.Segments.length === 1
                    ? flightData.Segments[0].Destination_City
                    : flightData.Segments[flightData.Segments.length - 1]
                        .Destination_City}
                </h4>
              </div>
              <p className="text-sm mt-2">
                <span>Wed, 28 Aug</span> *{" "}
                <span className="text-neutral-400">1h 0m</span> *{" "}
                <span className="text-neutral-400">Economy</span>
              </p>
            </div>
            <div className="flex items-center justify-between gap-4 mt-4">
              <div className="text-sm flex items-center gap-2 text-green-500 bg-green-500/20 p-1 w-fit rounded-xl">
                <Clock size={14} />
                <span>99% On time</span>
              </div>
            </div>

            {loading ? (
              <Simmer />
            ) : (
              <div>
                {repriceData.data?.AirRepriceResponses[0].Flight.Segments.map(
                  (segment, index) => (
                    <div key={index} className="bg-gray-500/20 p-3 mb-1 rounded-lg mt-4">
                      <div
                        
                        className="flex  md:flex-row items-center w-full gap-4  "
                      >
                        <div>
                          <Image
                            src="/images/QP.png"
                            alt="Airline Logo"
                            width={100} height={100}
                            className="w-8 h-8 md:w-16 md:h-16"
                          />
                          <div>
                            <p className="text-base font-semibold">
                              {segment.Airline_Name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {segment.Aircraft_Type} {segment.Airline_Code}
                            </p>
                            <p className="text-sm text-blue-500 font-medium">
                              Economy
                            </p>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold">
                            {segment.Departure_DateTime.split(" ")[1]}
                          </p>
                          <span className="text-sm text-gray-500">
                            {segment.Origin}
                          </span>
                        </div>
                        <div className="flex items-center justify-center w-full gap-4 md:px-4">
                          <div className="border-t-2 border-dashed border-gray-400 w-full"></div>
                          <div className="flex flex-col items-center text-center">
                            <FlightVector />
                            <p className="text-xs text-blue-500 whitespace-nowrap mt-1">
                              {segment.Duration}
                            </p>
                          </div>
                          <div className="border-t-2 border-dashed border-gray-400 w-full"></div>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold">
                            {segment.Arrival_DateTime.split(" ")[1]}
                          </p>
                          <p className="text-sm text-gray-500">
                            {segment.Destination}
                          </p>
                        </div>
                      </div>
                      <div className=" border-b-2 border-white mt-2 mb-2"></div>
                      <div className="flex md:flex-row flex-col items-center gap-5">
                        <div className="flex items-center gap-1">
                          <Image src="/icons/bag.png" className="w-8 h-8" width={100} height={100} alt="Checkout img" />
                          <div>
                            <span className="font-semibold mr-2 text-sm">
                              Cabin Baggage:
                            </span>
                            <span className="font-medium text-sm">
                              {
                                repriceData.data?.AirRepriceResponses[0].Flight
                                  .Fares[0].FareDetails[0].Free_Baggage
                                  .Check_In_Baggage
                              }{" "}
                              (1 piece only) / Adult
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Image src="/icons/suitcase.png" className="w-8 h-8" width={100} height={100} alt="Checkout img" />
                          <div>
                            <span className="font-semibold mr-2 text-sm">
                              Check-In Baggage:
                            </span>
                            <span className="font-medium text-sm">
                              {
                                repriceData.data?.AirRepriceResponses[0].Flight
                                  .Fares[0].FareDetails[0].Free_Baggage
                                  .Hand_Baggage
                              }{" "}
                              (1 piece only) / Adult
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Baggage Info */}
          {/* <div className="text-sm">
            <div className="flex justify-between items-center gap-4">
              <div>
                <p>Baggage</p>
                <p>Per Traveller</p>
              </div>
              <div>
                <p>Cabin</p>
                <p>{flightData.Fares[selectedIndex].FareDetails[0].Free_Baggage.Check_In_Baggage}kg (1 piece per person)</p>
              </div>
              <div>
                <p>Check-in</p>
                <p>{flightData.Fares[selectedIndex || 0].FareDetails[0].Free_Baggage.Hand_Baggage}kg (1 piece only)</p>
              </div>
            </div>
          </div> */}
        </div>

        {!userDetails && (
          <div className="bg-white mt-6 p-6 rounded-xl border-dashed border">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Travel Details</h1>
              <button
                onClick={() => {
                  setUserDetails(true);
                  setIsModalOpen(false);
                }}
              >
                <FaEdit className="w-6 h-6" style={{ color: "green" }} />
              </button>
            </div>
          </div>
        )}
        {userDetails && (
          <div>
            {/* Cancellation & Rescheduling Policy */}
            <div className="bg-white mt-6 p-6 rounded-xl border-dashed border">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">
                  Refund on Cancellation
                </h4>
                <h4 className="text-yellow text-sm cursor-pointer">
                  Cancellation & Rescheduling Policy
                </h4>
              </div>

              {/* Refund Details */}
              <div className="mt-6 border rounded-xl border-dashed p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-center items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-400">₹0 Refund</p>
                    <p className="text-sm text-gray-400">(₹2999 + ₹300)*</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400">₹0 Refund</p>
                    <p className="text-sm text-gray-400">(₹2999 + ₹300)*</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Now</p>
                    <p className="text-sm text-gray-400">14:31</p>
                  </div>
                </div>
                <div className="w-full bg-blue rounded-full h-2.5 my-6" />
                <div className="grid grid-cols-1 sm:grid-cols-3 justify-center items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Now</p>
                    <p className="text-sm text-gray-400">14:31</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Now</p>
                    <p className="text-sm text-gray-400">14:31</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Now</p>
                    <p className="text-sm text-gray-400">14:31</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-white mt-6 p-6 rounded-xl border-dashed border">
              <div>
                <h4 className="text-sm font-semibold">Contact Details</h4>
                <p className="text-sm text-neutral-400">
                  Your ticket & flight information will be sent here
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                <Input
                  placeholder="IND (+91)"
                  value={countryCode}
                  onChange={(e) => {
                    setCountryCode(e.target.value);
                  }}
                />
                <Input placeholder="Mobile Number" value={mobileNumber} onChange={(e) => {
                    setMobileNumber(e.target.value);
                  }} />
                <Input placeholder="Email" value={email} onChange={(e) => {
                    setEmail(e.target.value);
                  }} />
              </div>
            </div>

            {/* GST Details */}
            <div className="bg-white mt-6 p-6 rounded-xl border-dashed border">
              {/* Checkbox Section */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isGSTChecked}
                    onChange={handleCheckboxChangeGst}
                    className="mr-2 w-4 h-4"
                  />
                  <h3>
                    I have a GST number{" "}
                    <span className="text-sm font-light">(Optional)</span>
                  </h3>
                </label>
              </div>

              {/* GST Details Section (conditionally rendered) */}
              {isGSTChecked && (
                <div>
                  <div>
                    <h4 className="text-sm font-semibold mt-2">GST Details</h4>
                    <p className="text-sm text-neutral-400">
                      To claim for the GST charged by airlines, please enter
                      your GST details
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    <Input placeholder="GST" />
                    <Input placeholder="Company Name" />
                    <Input placeholder="Address" />
                    <Input placeholder="Pincode" />
                    <Input placeholder="City" />
                    <Input placeholder="State" />
                  </div>
                </div>
              )}
            </div>

            {/* Billing Address */}
            {/* <div className="bg-white mt-6 p-6 rounded-xl border-dashed border">
   <div>
     <h4 className="text-sm font-semibold">Billing Address</h4>
     <p className="text-sm text-neutral-400">
       As per the latest govt regulations, it’s mandatory to provide your
       address
     </p>
   </div>
   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-4">
     <Input placeholder="Pincode" />
     <Input placeholder="Address" />
     <Input placeholder="City" />
     <Input placeholder="State" />
   </div>
 </div> */}

            {/* Travelers Details */}
            <div className="bg-white mt-6 p-6 rounded-xl border-dashed border">
              <div>
                <h4 className="text-sm font-semibold">Travellers Details</h4>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-neutral-400">
                    Choose from the saved list or add a new passenger
                  </p>
                  <p>{`${
                    travelDetails.Adult_Count +
                    travelDetails.Child_Count +
                    travelDetails.Infant_Count
                  } Travellers`}</p>
                </div>
                <div className="text-sm px-4 py-1 rounded-md bg-yellow/20 text-neutral-800">
                  <p>
                    Please ensure that your name matches your govt. ID such as
                    Aadhar, Passport, or Driver&apos;s Licence
                  </p>
                </div>
                <div className="mt-6"></div>
              </div>

              {/* Adults Section */}
              <div>{renderForms("adults", "Adults (12 yrs or above)")}</div>

              {/* Children Section */}
              {travelDetails.Child_Count > 0 && (
                <div>{renderForms("children", "Children (2-12 yrs)")}</div>
              )}

              {/* Infants Section */}
              {travelDetails.Infant_Count > 0 && (
                <div>{renderForms("infants", "Infants (below 2 yrs)")}</div>
              )}
              <div>
                <p className="text-red-500">{error}</p>
              </div>
            </div>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-md mt-3"
              onClick={handleSubmit}
              // onClick={() => openModal()}
            >
              CONTINUE
            </button>
            {isModalOpen && (
              <div
                className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
                onClick={closeModal}
              >
                <div
                  className="bg-white rounded-xl w-11/12 sm:w-1/1 lg:w-2/6 p-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Review Details</h1>
                    <button
                      onClick={closeModal}
                      className="text-gray-600 hover:text-gray-800 p-2 rounded-full"
                    >
                      <FaTimes className="w-6 h-6" />
                    </button>
                  </div>
                  <p>
                    Please ensure that the spelling of your name and other
                    details match with your travel document/govt. ID, as these
                    cannot be changed later. Errors might lead to cancellation
                    penalties.
                  </p>
                  <div>
                    {/* Render adults */}
                    {paxDetails
                      .filter((item) => item.Pax_type === 0)
                      .map((traveler, index) =>
                        renderTravelerDetails(traveler, index, "Adult")
                      )}

                    {/* Render children */}
                    {paxDetails
                      .filter((item) => item.Pax_type === 1)
                      .map((traveler, index) =>
                        renderTravelerDetails(traveler, index, "Child")
                      )}

                    {/* Render infants */}
                    {paxDetails
                      .filter((item) => item.Pax_type === 2)
                      .map((traveler, index) =>
                        renderTravelerDetails(traveler, index, "Infant")
                      )}
                  </div>
                  <div>
                    <span className="flex items-center justify-end mt-4 gap-2">
                      <button className="text-yellow font-medium">EDIT</button>
                      <button
                        className="bg-yellow text-white font-medium py-1 px-3 rounded-full"
                        onClick={() => {
                          handleConfirm();
                        }}
                      >
                        CONFIRM
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {!seatsMeals && (
          <div className="bg-white mt-6 p-6 rounded-xl border-dashed border">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Seats & Meals</h1>
              <button
                onClick={() => {
                  setSeatsMeals(true);
                }}
              >
                <FaEdit className="w-6 h-6" style={{ color: "green" }} />
              </button>
            </div>
          </div>
        )}
        {seatsMeals && (
          <div className="bg-white mt-6 p-6 rounded-xl border-dashed border">
            <div>
              <div className="flex items-center gap-3">
                <h4>{flightData.Segments[0].Origin_City}</h4>
                <MoveRight />
                <h4>
                  {flightData.Segments.length === 1
                    ? flightData.Segments[0].Destination_City
                    : flightData.Segments[flightData.Segments.length - 1]
                        .Destination_City}
                </h4>
              </div>
              <p>
                {selectedSeats.length} of {totalTravelers} Seat(s) selected
              </p>
            </div>
            <div className="h-[600px] overflow-y-scroll">
              <div className="flex seat-map p-6 w-1/2 items-center justify-center mx-auto gap-6 mt-10">
                {/* Reserved */}
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">Reserved</span>
                  <span className="w-6 h-6 rounded-full bg-[#A1A1A1]"></span>
                </div>

                {/* Available */}
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">Available</span>
                  <span className="w-6 h-6 rounded-full bg-[#89CFF0]"></span>
                </div>

                {/* Selected */}
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">Selected</span>
                  <span className="w-6 h-6 rounded-full bg-yellow"></span>
                </div>
              </div>

              <div className="seat-map p-6 w-1/2 items-center mx-auto ">
                <Image
                  src="/icons/flightLogo.png"
                  width={100}
                  height={100}
                  alt="Checkout img"
                  className="w-2/3 items-center mx-auto mb-10"
                />

                {seatsData?.data?.AirSeatMaps[0]?.Seat_Segments?.map(
                  (segment, index) => (
                    <div key={index} className="seat-segment mb-6">
                      {/* <h2 className="text-lg font-semibold">Segment {index + 1}</h2> */}
                      {segment.Seat_Row.map((row, rowIndex) => (
                        <div
                          key={rowIndex}
                          className="seat-row flex items-center justify-center space-x-3 mb-4"
                        >
                          {renderSeats(row.Seat_Details)}
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-md mt-3"
              onClick={handleSeatsMeals}
            >
              CONTINUE
            </button>
          </div>
        )}
        {!seatsMeals && !userDetails && (
          <div className="bg-white mt-6 p-6 rounded-xl border-dashed border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={checkedTravelers}
                  onChange={() => handleCheckboxChange(traveler.Pax_Id)}
                  className="mr-2 w-4 h-4"
                />
                <p>
                  I understand and agree with the Fare Rules , the Privacy
                  Policy , the User Agreement and Terms of Service of MakeMyTrip
                </p>
              </div>
            </div>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-md mt-3"
              onClick={handleTempBooking}
              // onClick={() => openModal()}
            >
              PROCEED TO PAY
            </button>
          </div>
        )}
      </div>

      {/* Right Section (Fare Summary & Offers) */}
      <div className="space-y-6 bg-white p-6 rounded-xl border-dashed border">
        <div className="flex justify-between items-center rounded-xl">
          <h4 className="text-sm font-semibold">Fare Summary</h4>
          <p className="text-sm text-neutral-400">
            {travelerCounts.a + travelerCounts.c + travelerCounts.i} Travellers
          </p>
        </div>
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex justify-between items-center text-sm">
            <p>Fare Type</p>
            <p className="text-green-500">
              {fareTypeMapping[
                repriceData.data?.AirRepriceResponses[0].Flight.Fares[0]
                  .FareType
              ] || "Unknown Fare Type"}
            </p>
          </div>
          <div className="flex justify-between items-center text-sm">
            <p>Base Fare</p>
            <p className="text-green-500">
              ₹
              {
                repriceData.data?.AirRepriceResponses[0].Flight.Fares[0]
                  .FareDetails[0].Basic_Amount
              }
            </p>
          </div>
          <div className="flex justify-between items-center text-sm">
            <p>Taxes & Fees</p>
            <p className="text-green-500">
              ₹
              {
                repriceData.data?.AirRepriceResponses[0].Flight.Fares[0]
                  .FareDetails[0].AirportTax_Amount
              }
            </p>
          </div>
          <div className="flex justify-between items-center text-sm border-t border-dashed border-neutral-400 pt-2">
            <p className="text-sm font-semibold">Total Amount</p>
            <p className="text-lg font-semibold">
              ₹
              {
                repriceData.data?.AirRepriceResponses[0].Flight.Fares[0]
                  .FareDetails[0].Total_Amount
              }
            </p>
          </div>
        </div>
        <p className="text-xs mt-4">
          By clicking on continue, I confirm that I have read, understood, and
          agree with the Fare Rules, Privacy Policy, and Terms of Use
        </p>
        <div className="border-2 border-blue rounded-xl p-4 bg-blue/10 text-sm mt-4">
          <p>
            Log in to access amazing offers & redeem Tripbookngo wallet on your
            flight booking
          </p>
        </div>
        <div className="border border-dashed p-4 flex justify-between items-center flex-col gap-4 mt-4">
          <div>
            <div className="flex items-center gap-4">
              <Checkbox />
              <p className="text-sm">OFFER 1</p>
            </div>
            <p className="text-xs">
              Get 15% off on your fare. Book now and avail the discount on your
              next flight.
            </p>
            <p className="text-sm text-yellow">₹500 off</p>
          </div>
          <div>
            <div className="flex items-center gap-4">
              <Checkbox />
              <p className="text-sm">OFFER 2</p>
            </div>
            <p className="text-xs">
              Get 15% off on your fare. Book now and avail the discount on your
              next flight.
            </p>
            <p className="text-sm text-yellow">₹500 off</p>
          </div>
        </div>
      </div>
    </div>
  );
}
