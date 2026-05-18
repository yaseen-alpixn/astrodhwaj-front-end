import Image from "next/image";

const plans = [{ price: 100 }, { price: 200 }, { price: 500 }];

export default function ReikiHealing() {
  return (
    <div className="w-full px-4 py-6">
      <p className="text-[18px] font-semibold tracking-[-0.04em] mb-2">
        Choose Your Session For Reiki Healing
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan, i) => (
          <div
            key={i}
            className=" rounded-2xl shadow-md overflow-hidden flex flex-col"
          >
            <div className="relative w-full h-[160px] sm:h-[180px] md:h-[172px]">
              <Image
                src="/images/HomepageReiki.png"
                alt="Reiki healing session"
                fill
                className="object-cover rounded-t-2xl"
              />
            </div>

            <div className="p-4 flex flex-col gap-2 flex-grow">
              <div className="flex items-center gap-2">
                <span className="text-[20px] font-bold text-[#4898E1]">
                  ₹{plan.price}
                </span>
                <span className="text-[12px] font-normal text-gray-500">
                  /30 min
                </span>
              </div>

              <h3 className="text-[16px] font-semibold">Distance Healing</h3>

              <p className="text-[13px] font-normal leading-[22px] text-gray-600">
                Receive Powerful Reiki Energy From The Comfort Of Your Home
              </p>

              <div className="mt-2">
                <p className="text-[14px] font-medium text-gray-500 mb-2">
                  Benefits:
                </p>

                <div className="flex flex-wrap gap-1">
                  <span className="px-3 py-1 text-[11px] font-medium bg-blue-100 text-[#4898E1] rounded-full whitespace-nowrap">
                    Stress Relief
                  </span>
                  <span className="px-3 py-1 text-[11px] font-medium bg-blue-100 text-[#4898E1] rounded-full whitespace-nowrap">
                    Emotional Healing
                  </span>
                  <span className="px-3 py-1 text-[11px] font-medium bg-blue-100 text-[#4898E1] rounded-full whitespace-nowrap">
                    Energy Balance
                  </span>
                </div>
              </div>

              <button className="mt-4 bg-gradient-to-r from-[#4898E1] to-[#3a78b2] text-white py-2 rounded-lg text-[13px] font-medium hover:opacity-90 transition">
                Book Session
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
