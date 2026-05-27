"use client";

interface PaymentCardProps {
  courseTitle?: string;
  instructor?: string;
  amount?: number;
  onPayNow?: () => void;
  onCancel?: () => void;
}

export default function PaymentCard({
  courseTitle = "Vedic Astrology: Reading Your Birth Chart",
  instructor = "Dr. Rajesh Sharma",
  amount = 299,
  onPayNow,
  onCancel,
}: PaymentCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        {/* Header */}
        <h2 className="mb-4 text-[18px] font-semibold text-[#4898E1]">
          Complete Payment
        </h2>

        {/* Course Card */}
        <div className="mb-6 rounded-xl bg-gradient-to-r from-amber-100 via-amber-50 to-pink-100 p-4">
          <h3 className="text-[16px] font-semibold text-gray-900">{courseTitle}</h3>
          <p className="mt-1 text-[12px] font-normal text-gray-600">By {instructor}</p>
        </div>

        {/* Amount */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-[16px] font-semibold text-gray-900">Total Amount:</p>
            <p className="text-[12px] font-normal text-gray-500">
              Includes Lifetime Access To Recording
            </p>
          </div>
          <p className="text-[20px] font-bold text-[#4898E1]">₹{amount}</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onPayNow}
            className="w-full rounded-full bg-[#4898E1] py-3 text-white hover:bg-[#4898E1]/90"
          >
            Pay Now
          </button>
          <button
            onClick={onCancel}
            className="w-full rounded-full border-2 border-[#4898E1] py-3 text-gray-900 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-[12px] font-normal text-gray-400">
          Secure Payment Powered By AstroDhwaj
        </p>
      </div>
    </div>
  );
}
