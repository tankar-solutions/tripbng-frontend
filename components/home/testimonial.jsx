import Image from 'next/image'
import React from 'react'

const testimonials = [
    {
        name: "Maskhan singh",
        role: "Punjab",
        image: "/images/makkhan.png",
        quote: "I've used Tripbooking for all my business travels and they never disappoint. The seamless booking process and great prices keep me coming back.",
        rating: 5
    },
    {
        name: "Sarah M.",
        role: "Mumbai",
        image: "/images/sarah.png",
        quote: "Booking my holiday was a breeze with Tripbooking. Their customer service was exceptional, and I got amazing deals on flights. I will highly recommend them!",
        rating: 5
    },
    {
        name: "Michel",
        role: "Japan",
        image: "/images/michel.png",
        quote: "Our family vacation was perfect thanks to Tripbooking. They found us the best deals and even helped us with itinerary planning. A fantastic experience!",
        rating: 5
    }
]

const StarRating = ({ rating }) => {
    return (
        <div className="flex gap-1">
            {[...Array(rating)].map((_, i) => (
                <Image
                    key={i}
                    src={"/icons/star.png"}
                    width={20}
                    height={100}
                    alt='star-icon'
                />
            ))}
        </div>
    )
}

export default function Testimonial() {
    return (
        <div className=" py-12 px-4 sm:px-6 lg:px-8 mb-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
                    <span className='text-blue'>Great Words</span> from Our Customers
                </h2>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-white rounded-lg overflow-hidden">
                            <div className="px-6 py-8">
                                <div className="flex items-center mb-4">
                                    <Image className="rounded-full object-cover" src={testimonial.image} alt={testimonial.name} width={70} height={100} />
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">{testimonial.name}</h3>
                                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-4">{testimonial.quote}</p>
                                <StarRating rating={testimonial.rating} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}