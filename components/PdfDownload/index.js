import React from "react";
import html2pdf from "html2pdf.js";

const PdfDownload = ({ booking }) => {
  const downloadPDF = () => {
    const element = document.createElement("div");
    element.innerHTML = `
      <div class="p-4 mx-auto bg-white shadow-lg rounded-lg">
        <div class="flex items-start justify-between mb-6">
          <div>
            <img src="/icons/pdfIcon.png" class="w-36 mb-2" />
            <p><b>Booking Date:</b> 29 Nov 2024 07:11 PM</p>
            <p><b>Fare Type:</b> <span class="text-blue font-semibold">Refundable</span></p>
          </div>
          <div class="flex flex-col items-end">
            <p><b>PNR:</b> <span class="text-blue font-semibold">685GQA</span></p>
            <p><b>Booking ID:</b> <span class="text-blue font-semibold">FLT202411291911421864</span></p>
          </div>
        </div>

        <div class="border-b border-gray-200 mb-4"></div>
        <div class="flex justify-between bg-blue/30 rounded-lg items-center pb-4 px-2">
          <p class="font-semibold text-blue">DELHI TO AHMEDABAD</p>
          <p class="font-semibold text-blue">01h 30m</p>
        </div>

        <div class="flex items-center gap-16 mt-6 mb-6">
          <div>
            <img src="/icons/pdfFlight.png" class="w-24 mb-2" />
            <p class="font-medium text-blue">AirIndia</p>
            <p class="font-light text-gray">AI - Economy - 2959</p>
          </div>
          <div class="flex items-center gap-10">
            <div class="flex flex-col items-end">
              <p class="text-sm text-gray">DELHI</p>
              <p class="text-lg"><span class="text-blue">DEL</span> 06:30</p>
              <p>Tue - 03 Dec 2024</p>
              <p class="text-gray-500">Terminal: 3</p>
            </div>
            <div class="text-center">
              <p>1h 30m</p>
              <p>Economy</p>
            </div>
            <div class="flex flex-col items-start">
              <p class="text-sm text-gray">AHMEDABAD</p>
              <p class="text-lg"><span class="text-blue">AMD</span> 08:00</p>
              <p>Tue - 03 Dec 2024</p>
              <p class="text-gray-500">Terminal: 1</p>
            </div>
          </div>
        </div>

        <div class="border-b border-gray-200"></div>

        <div>
                  <p class="text-gray-500"><span class="text-lg text-blue font-semibold">PASSENGER</span> ( Phone : 9904956474 Email : info@tripbookngo.com )</p>

          <table class="min-w-full border border-gray-400 mt-4">
  <thead>
    <tr class="bg-blue/30 text-blue-900">
      <th class="pb-4 px-4 font-semibold text-left text-blue">Flight</th>
      <th class="pb-4 px-4 font-semibold text-left text-blue">Passenger Name</th>
      <th class="pb-4 px-4 font-semibold text-left text-blue">Ticket No.</th>
      <th class="pb-4 px-4 font-semibold text-left text-blue">Baggage Information</th>
    </tr>
  </thead>
  <tbody>
    <tr class="bg-gray-50 border-b">
      <td class="py-4 px-4 text-left border-r">
        <div class="text-sm font-medium">DEL - AMD</div>
        <div class="text-sm text-gray-500">AI 2959</div>
      </td>
      <td class="py-4 px-4 text-left ">
        <div class="text-sm font-medium">Mr VIKASH DETROJA</div>
        <div class="text-sm text-gray-500">Adult</div>
        <img
          src="https://via.placeholder.com/120x40"
          alt="Barcode"
          class="mt-2"
        />
      </td>
      <td class="py-4 px-4 text-left text-sm font-medium">0983423640729</td>
      <td class="py-4 px-4 text-left text-sm">
        <span class="font-bold">Check-In:</span> 15kg<br />
        <span class="font-bold">Cabin:</span> 7kg
      </td>
    </tr>
    <!-- Row 2 -->
    <tr class="bg-white border-b">
      <td class="py-4 px-4 text-left border-r">
        <div class="text-sm font-medium">DEL - AMD</div>
        <div class="text-sm text-gray-500">AI 2959</div>
      </td>
      <td class="py-4 px-4 text-left">
        <div class="text-sm font-medium">Mr PARTH SAVAJADIYA</div>
        <div class="text-sm text-gray-500">Adult</div>
        <img
          src="https://via.placeholder.com/120x40"
          alt="Barcode"
          class="mt-2"
        />
      </td>
      <td class="py-4 px-4 text-left text-sm font-medium">0983423640730</td>
      <td class="py-4 px-4 text-left text-sm">
        <span class="font-bold">Check-In:</span> 15kg<br />
        <span class="font-bold">Cabin:</span> 7kg
      </td>
    </tr>
    <tr class="bg-gray-50">
      <td class="py-4 px-4 text-left border-r">
        <div class="text-sm font-medium">DEL - AMD</div>
        <div class="text-sm text-gray-500">AI 2959</div>
      </td>
      <td class="py-4 px-4 text-left">
        <div class="text-sm font-medium">Mr PENIL VORA</div>
        <div class="text-sm text-gray-500">Adult</div>
        <img
          src="https://via.placeholder.com/120x40"
          alt="Barcode"
          class="mt-2"
        />
      </td>
      <td class="py-4 px-4 text-left text-sm font-medium">0983423640731</td>
      <td class="py-4 px-4 text-left text-sm">
        <span class="font-bold">Check-In:</span> 15kg<br />
        <span class="font-bold">Cabin:</span> 7kg
      </td>
    </tr>
  </tbody>
</table>
        </div>

        <div>
<h2 class="text-lg text-blue font-semibold">PRICE INFORMATION</h2>
<div class="mt-3 border rounded-lg px-3 pb-10">
<div class="flex items-center justify-between">
<p class="font-light">Base Fare </p>
<p class="font-light">INR 15961 </p>
</div>
</div>
        </div>

        <p class="text-sm text-gray-500 mt-4">Page 1</p>
      </div>
    `;

    document.body.appendChild(element);

    html2pdf(element, {
      margin: 10,
      filename: `${booking._id}_booking_details.pdf`,
      jsPDF: { unit: "mm", format: "a4" },
    });

    document.body.removeChild(element);
  };

  return (
    <button
      className="text-blue-500 hover:underline flex items-center"
      onClick={downloadPDF}
    >
      <span className="mr-1">Download</span>
    </button>
  );
};

export default PdfDownload;
