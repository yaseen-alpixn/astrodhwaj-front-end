"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Rajesh Mehta",
    role: "User",
    avatar: "/images/profile.svg",
    rating: 4,
    text: "AstroConnect has transformed my life! The astrologers are genuine and their predictions are accurate.",
  },
  {
    id: 2,
    name: "Rajesh Mehta",
    role: "User",
    avatar: "/images/profile.svg",
    rating: 5,
    text: "AstroConnect has transformed my life! The astrologers are genuine and their predictions are accurate.",
  },
  {
    id: 3,
    name: "Rajesh Mehta",
    role: "User",
    avatar: "/images/profile.svg",
    rating: 5,
    text: "AstroConnect has transformed my life! The astrologers are genuine and their predictions are accurate.",
  },
  {
    id: 4,
    name: "Rajesh Mehta",
    role: "User",
    avatar: "/images/profile.svg",
    rating: 5,
    text: "AstroConnect has transformed my life! The astrologers are genuine and their predictions are accurate.",
  },
];

// Extended list for continuous scrolling
const extendedTestimonials = [...testimonials, ...testimonials, ...testimonials];

function UserTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const update = () => setItemsPerView(window.innerWidth < 768 ? 1 : 3);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlay]);

  // Reset to beginning when reaching the end for infinite scroll
  useEffect(() => {
    if (currentIndex >= testimonials.length) {
      const timer = setTimeout(() => {
        setCurrentIndex(currentIndex - testimonials.length);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  const translateValue = -(currentIndex * (100 / itemsPerView));

  return (
    <section
      className="relative w-full overflow-hidden px-5 py-16 sm:px-8 sm:py-20 lg:px-10"
      style={{
        background: "linear-gradient(90deg, #e9d5ff 0%, #fef3c7 100%)",
      }}
    >
      {/* Header */}
      <div className="mb-14 flex flex-col items-center text-center">
        <h2 className="text-[2.2rem] font-bold tracking-[-0.02em] text-gray-900 sm:text-[2.8rem]">
          What Our Users Say
        </h2>
      </div>

      {/* Testimonials Carousel */}
      <div className="mx-auto max-w-[1360px]">
        <div className="relative">
          {/* Slider Container */}
          <div className="overflow-hidden">
            {/* Carousel Track */}
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(${translateValue}%)`,
              }}
            >
              {extendedTestimonials.map((testimonial, index) => (
                <div
                  key={`${testimonial.id}-${Math.floor(index / testimonials.length)}`}
                  className="w-full flex-shrink-0 px-3 md:w-1/3"
                >
                  <div className="rounded-[20px] bg-white/95 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-sm transition-transform hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] hover:scale-105 h-full flex flex-col sm:p-8">
                    {/* Star Rating */}
                    <div className="mb-4 flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          className={`${
                            i < testimonial.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <p className="mb-6 flex-1 text-base leading-relaxed text-gray-700 sm:text-lg">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>

                    {/* User Info */}
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-200 flex-shrink-0">
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsAutoPlay(false);
                }}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex % testimonials.length
                    ? "w-8 bg-gray-900"
                    : "w-2 bg-gray-400 hover:bg-gray-600"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default UserTestimonials;
