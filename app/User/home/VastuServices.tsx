import Image from "next/image";

const cards = [
  { price: "₹100", time: "/30 min" },
  { price: "₹200", time: "/30 min" },
  { price: "₹500", time: "/30 min" },
];

export default function VastuServices() {
  return (
    <section className="w-full bg-white px-4 py-4 mt-6">
      <h5 className="text-[18px] font-semibold mb-2">Our Services For Vastu</h5>

      <div className=" mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card, index) => (
            <div
              key={index}
              className="w-full h-auto lg:h-[589px] rounded-[15px] border border-black/10 p-[15px] bg-[#F4F4F4] shadow-md flex flex-col"
            >
              <div className="relative w-full h-[160px] sm:h-[170px] lg:h-[172px] rounded-[15px] overflow-hidden">
                <Image
                  src="/images/HomepageVastu.png"
                  alt="Vastu Consultation"
                  fill
                  className="object-cover"
                />
              </div>

              {/* PRICE */}
              <div className="flex items-center gap-[5px] mt-4">
                <h2 className="text-[20px] font-bold text-[#D4AF00] leading-none">
                  {card.price}
                </h2>
                <span className="text-[12px] font-normal text-gray-500">
                  {card.time}
                </span>
              </div>

              {/* TITLE */}
              <h3 className="mt-3 text-[16px] font-semibold capitalize text-black">
                Vastu Consultation
              </h3>

              {/* DESCRIPTION */}
              <p className="mt-3 text-[13px] font-normal leading-[22px] text-[#444]">
                Complete Home/Office Vastu Analysis And Recommendations.
              </p>

              {/* INCLUDES */}
              <div className="my-4 lg:mt-5">
                <p className="text-gray-500 text-[14px] font-medium mb-2 lg:mb-3">
                  Includes:
                </p>

                <ul className="space-y-1">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-1 text-[12px] font-normal text-[#444]"
                    >
                      <span className="w-2 h-2 rounded-full  bg-purple-700"></span>
                      Lorem Ipsum Dolor Sit Amet.
                    </li>
                  ))}
                </ul>
              </div>

              {/* BUTTON */}
              <button className=" lg:mt-auto w-full h-[45px] lg:h-[50px] rounded-[10px] bg-[#d8bd3a] text-white text-[13px] font-medium hover:opacity-90 transition">
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
