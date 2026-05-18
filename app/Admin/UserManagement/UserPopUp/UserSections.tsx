"use client";

import {
  Phone,
  MessageSquare,
  Video,
  Wallet,
  Mail,
  MapPin,
} from "lucide-react";

export default function UserSections() {
  return (
    <div className="space-y-6">
      {/* Consultation Breakdown */}
      <div className="border rounded-xl p-5">
        <div className="flex justify-between mb-4">
          <h2 className="text-[20px] font-medium">Consultation Breakdown</h2>
          <span className="text-sm text-gray-500">12 total sessions</span>
        </div>

        <div className="flex gap-4">
          {[
            { icon: <Phone />, title: "Audio Call" },
            { icon: <MessageSquare />, title: "Chat" },
            { icon: <Video />, title: "Video Call" },
          ].map((item, i) => (
            <div key={i} className="flex-1 border rounded-xl p-4">
              <div className="flex justify-between mb-2">
                {item.icon}
                <span className="text-[#4898E1] font-medium">42%</span>
              </div>

              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-gray-500">3 sessions</p>
              <p className="text-[#4898E1] mt-1">₹3000</p>

              <div className="w-full h-[6px] bg-gray-200 rounded-full mt-2">
                <div className="w-[60%] h-full bg-[#4898E1] rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Spending */}
      <div className="border rounded-xl p-5">
        <h2 className="text-[20px] font-medium mb-4">Monthly Spending Trend</h2>

        {["January", "February", "March"].map((m, i) => (
          <div key={i} className="mb-4">
            <div className="flex justify-between">
              <span>{m}</span>
              <span>₹2,500</span>
            </div>

            <div className="w-full h-[8px] bg-gray-200 rounded-full mt-1">
              <div
                className="h-full bg-yellow-500 rounded-full"
                style={{ width: `${60 + i * 15}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Wallet Recharges */}
      <div className="border rounded-xl p-5">
        <h2 className="text-[20px] font-medium mb-4">
          Recent Wallet Recharges
        </h2>

        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-gray-50 p-4 rounded-lg mb-3"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Wallet className="text-green-600" size={18} />
                </div>

                <div>
                  <p className="font-medium">₹2,000</p>
                  <p className="text-sm text-gray-500">28 March</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-[#4898E1]/10 text-[#4898E1] text-sm">
                UPI
              </span>
            </div>
          ))}
      </div>

      {/* Contact Info */}
      <div className="border rounded-xl p-5">
        <h2 className="text-[20px] font-medium mb-4">Contact Information</h2>

        <div className="flex gap-4">
          <div className="flex-1 bg-gray-50 p-4 rounded-lg flex items-center gap-2">
            <Mail size={18} /> rahul.k@email.com
          </div>

          <div className="flex-1 bg-gray-50 p-4 rounded-lg flex items-center gap-2">
            <Phone size={18} /> +91 9876543210
          </div>

          <div className="flex-1 bg-gray-50 p-4 rounded-lg flex items-center gap-2">
            <MapPin size={18} /> Mumbai, India
          </div>
        </div>
      </div>
    </div>
  );
}
