import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from 'next/image';
import { TravelOfferData } from './offer-data';
import Button from '@/components/ui/button';

export default function AllOffers() {
  return (
    <div>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {TravelOfferData.allOffers.map((item, i) => (
            <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/5">
              <div className='bg-[#f1f5f9] rounded-md p-3 space-y-3'>
                <div className='relative aspect-w-16 aspect-h-9'>
                <Image
  src={item.image}
  alt={item.title}
  objectFit="cover"
  className="rounded-md w-full"
  width={300}
  height={100}
/>

                </div>
                <h3 className='text-black text-md font-semibold'>{item.title}</h3>
                <p className='text-xs text-[#999999]'>{item.desc}</p>
                <div className='flex justify-between items-center'>
                  <p className='text-[#999999] text-sm'>
                    {item.tag}
                  </p>
                  <Button>
                    BOOK NOW
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}
