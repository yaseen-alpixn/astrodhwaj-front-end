"use client";

import Link from "next/link";
import { useState } from "react";

const usersSteps = [
  {
    step: "STEP 01",
    title: "Create Account",
    description: "Sign up and add money to your wallet",
    bgImage: "/images/step-1.svg",
  },
  {
    step: "STEP 02",
    title: "Browse Astrologers",
    description: "Choose from certified astrologers",
    bgImage: "/images/step-2.svg",
  },
  {
    step: "STEP 03",
    title: "Get Consultation",
    description: "Receive personalized guidance",
    bgImage: "/images/step-3.svg",
  },
];

const astrologersSteps = [
  {
    step: "STEP 01",
    title: "Register Profile",
    description: "Create and verify your profile",
    bgImage: "/images/step-1.svg",
  },
  {
    step: "STEP 02",
    title: "Set Services",
    description: "Choose consultation type",
    bgImage: "/images/step-2.svg",
  },
  {
    step: "STEP 03",
    title: "Start Earning",
    description: "Receive clients & earn",
    bgImage: "/images/step-3.svg",
  },
];

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState<"users" | "astrologers">("users");

  const steps = activeTab === "users" ? usersSteps : astrologersSteps;

  return (
    <section className="w-full bg-white py-5 px-5 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-[2.8rem] md:text-[4rem] font-semibold tracking-tight text-black">
            How It Works
          </h2>

          {/* Tabs */}
          <div className="mt-8 flex w-full  flex justify-center rounded-2xl bg-gray-200 p-1">
            <button
              onClick={() => setActiveTab("users")}
              className={`flex-1 rounded-xl py-3 sm:py-4 text-sm sm:text-base md:text-lg font-medium transition-all ${
                activeTab === "users"
                  ? "bg-[#6f18b6] text-white shadow-md"
                  : "text-gray-600"
              }`}
            >
              For Users
            </button>

            <button
              onClick={() => setActiveTab("astrologers")}
              className={`flex-1 rounded-xl py-3 sm:py-4 text-sm sm:text-base md:text-lg font-medium transition-all ${
                activeTab === "astrologers"
                  ? "bg-[#6f18b6] text-white shadow-md"
                  : "text-gray-600"
              }`}
            >
              For Astrologers
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((item, index) => {
            const href =
              activeTab === "users"
                ? item.title === "Create Account"
                  ? "/signup/user"
                  : item.title === "Browse Astrologers"
                    ? "/talk-to-astrologer"
                    : item.title === "Get Consultation"
                      ? "/talk-to-astrologer"
                      : "#"
                : item.title === "Register Profile"
                  ? "/signup/astrologer"
                  : item.title === "Set Services"
                    ? "/Astrologer/Settings"
                    : item.title === "Start Earning"
                      ? "/Astrologer/Wallet"
                      : "#";

            return (
              <Link key={index} href={href}>
                <div
                  className="relative overflow-hidden rounded-3xl group shadow-lg h-[340px]"
                  style={{
                    backgroundImage: `
          linear-gradient(
            to top,
            rgba(0,0,0,0.8),
            rgba(0,0,0,0.1)
          ),
          url(${item.bgImage})
        `,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Step */}
                  <span className="absolute top-6 left-6 text-white text-[15px] font-medium z-10">
                    {item.step}
                  </span>

                  {/* Bottom Content */}
                  <div className="absolute bottom-7 left-6 right-6 z-10">
                    <h3 className="text-[2rem] font-semibold text-white">
                      {item.title}
                    </h3>

                    <p className="text-[1.2rem] text-white/90 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Hover */}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-all duration-300" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
