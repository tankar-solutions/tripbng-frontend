import React from 'react'
import { Icons } from '../icons'
import Image from 'next/image'
import { Container } from '../ui'

const ctaData = [
    {
        title: "Where 2 go",
        icon: Icons.globe
    },
    {
        title: "Insurance For International Trips",
        icon: Icons.boarding
    },
    {
        title: "Gift Cards",
        icon: Icons.giftCard
    },
    {
        title: "MICE",
        icon: Icons.people
    },
    {
        title: "Explore International Flights",
        icon: Icons.earth
    },
    {
        title: "Travel Guide",
        icon: Icons.compass
    }
]

export default function Cta() {
    return (
        <Container className="bg-transparent">
            <div className='flex flex-wrap justify-between items-center divide-y  md:mt-36 divide-gray-200 md:divide-y-0 md:divide-x-2 border p-4 rounded-xl bg-white'>
                {ctaData.map((item, index) => (
                    <div key={index} className='flex w-full md:w-auto items-center gap-4 p-4'>
                        <div className='flex-shrink-0'>
                            <Image src={item.icon} alt={item.title} width={24} height={24} />
                        </div>
                        <h3 className='text-sm font-normal'>{item.title}</h3>
                    </div>
                ))}
            </div>
        </Container>
    )
}
