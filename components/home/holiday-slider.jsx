'use client'
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import Button from '../ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '../ui';
import { Icons } from '../icons';

const SliderHolidayData = [
  {
    title: "Ahmedabad",
    image: "/images/place1.png",
    price: 6000,
  },
  {
    title: "Jaipur",
    image: "/images/place2.png",
    price: 15000,
  },
  {
    title: "Udaipur",
    image: "/images/place3.png",
    price: 15000,
  },
  {
    title: "Nainital",
    image: "/images/place4.png",
    price: 30000,
  },
  {
    title: "Kochi",
    image: "/images/place5.png",
    price: 15000,
  },
];

export default function HolidaySlider() {
  return (
    <Container>
      <div className='flex flex-col md:flex-row justify-between items-center mb-6'>
        <div className='mb-4 md:mb-0'>
          <h2 className='text-2xl md:text-3xl font-semibold mb-2'>
            Enjoy <span className='text-blue'>Top Holiday Packages</span>
          </h2>
          <p className='text-sm md:text-base font-light'>
            Discover the best holiday packages that fit your budget for your favourite destinations.
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
      </div>
      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        navigation={true}
        modules={[Navigation]}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
          1280: {
            slidesPerView: 5,
            spaceBetween: 30,
          },
        }}
      >
        {SliderHolidayData.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className='bg-black rounded-md p-3'>
              <div className='relative aspect-w-16 aspect-h-9 mb-3'>
                <Image
                  src={slide.image}
                  alt={slide.title}
                  objectFit='cover'
                  className='rounded-md w-full'
                  width={300}
                  height={100}
                />
              </div>
              <div className='flex justify-between items-center'>
                <h3 className='text-white text-sm md:text-base'>{slide.title}</h3>
                <p className='text-yellow text-sm md:text-base'>₹{slide.price}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <Link href={"/"} className='flex items-center gap-3 text-yellow font-light mt-3 justify-end'>
        Explore All
        {Icons.arrowRight}
      </Link>
    </Container>
  );
}