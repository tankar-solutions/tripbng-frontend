import React from 'react';
import { Container } from '../ui';
import Image from 'next/image';
import Button from '../ui/button';
import Link from 'next/link';
import { Icons } from '../icons';

const dealsData = [
  {
    title: "XYZ-CCu",
    price: "INR 2800 Onwards",
    image: "/images/9I.png"
  },
  {
    title: "ABC-XYZ",
    price: "INR 3500 Onwards",
    image: "/images/AI.png"
  },
  {
    title: "DEF-GHI",
    price: "INR 3000 Onwards",
    image: "/images/I5.png"
  },
  {
    title: "JKL-MNO",
    price: "INR 2500 Onwards",
    image: "/images/indido.png"
  },
  {
    title: "PQR-STU",
    price: "INR 2000 Onwards",
    image: "/images/indido.png"
  },
  {
    title: "VWX-YZW",
    price: "INR 2200 Onwards",
    image: "/images/QP.png"
  },
  {
    title: "XYZ-CCu",
    price: "INR 2800 Onwards",
    image: "/images/QP.png"
  },
  {
    title: "ABC-XYZ",
    price: "INR 3500 Onwards",
    image: "/images/Uk.png"
  }
]

export default function FlightDeals() {
  return (
    <Container>
      <div className='flex flex-col md:flex-row gap-6 md:gap-10'>
        <div className='flex flex-col md:w-1/3 lg:w-1/4'>
          <div className='mb-4'>
            <h2 className='text-3xl md:text-5xl font-semibold mb-2 text-blue'>
              Best Flight Deals
            </h2>
            <p className='text-sm md:text-base font-light'>
              Choose the most suitable flight option suggested for you.
            </p>
          </div>
          <div className='flex items-center gap-4'>
            <Button className='text-sm md:text-base'>
              Domestic
            </Button>
            <Button className='text-sm md:text-base'>
              International
            </Button>
          </div>
          <Link href={"/"} className='flex items-center gap-3 text-yellow font-light mt-3'>
            Explore All
            {Icons.arrowRight}
          </Link>
        </div>
        <div className='md:w-2/3 lg:w-3/4 flex flex-wrap gap-6'>
          {dealsData.map((deal, index) => (
              <div key={index} className='flex items-center gap-4 border rounded-xl p-4 flex-col'>
                <div className='flex-shrink-0'>
                  <Image src={deal.image} alt={deal.title} width={64} height={64} />
                </div>
                <div>
                  <h3 className='text-sm font-medium'>{deal.title}</h3>
                  <p className='text-xs font-light text-yellow'>{deal.price}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </Container>
  );
}
