'use client'
import React, { useState } from 'react'
import { Container } from '../ui'
import { AllOffers, BusOffers, FlightOffers, HolidayOffers, HotelOffers } from './travel-offer-slider'

const offerTabs = [
    { name: "All Offers", component: AllOffers },
    { name: "Flights", component: FlightOffers },
    { name: "Hotels", component: HotelOffers },
    { name: "Bus", component: BusOffers },
    { name: "Holidays", component: HolidayOffers }
]

export default function OffersCard() {
    const [activeTab, setActiveTab] = useState(offerTabs[0].name)

    return (
        <Container className="px-4 py-8 md:py-12">
            <div className='flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 max-w-7xl mx-auto'>
                <h2 className='text-3xl md:text-4xl font-semibold'>
                    <span className='text-yellow'>OFFERS</span> makes Trips Cheaper.....
                </h2>
                <p className='text-sm font-light md:w-1/3'>
                    {/* Lorem ipsum dolor sit amet consectetur */}
                </p>
            </div>
            <div className='bg-white rounded-xl p-4 md:p-6 mt-6 md:mt-8'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                    <div className='flex flex-wrap items-center gap-4'>
                        {offerTabs.map(({ name }) => (
                            <button
                                key={name}
                                className={`flex items-center gap-2 border-b-4 pb-2 transition-colors ${activeTab === name ? 'border-blue text-blue' : 'border-transparent hover:border-gray-300'}`}
                                onClick={() => setActiveTab(name)}
                            >
                                <span>{name}</span>
                            </button>
                        ))}
                    </div>
                    <button className='flex items-center gap-2 text-sm font-medium text-yellow hover:underline'>
                        VIEW ALL
                    </button>
                </div>
            </div>
            <div className="mt-6 md:mt-8">
                {offerTabs.find(tab => tab.name === activeTab)?.component()}
            </div>
        </Container>
    )
}
