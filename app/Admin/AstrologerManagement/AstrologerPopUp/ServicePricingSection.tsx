import { Phone, MessageSquare, Video } from "lucide-react";

export default function ServicePricingSection() {
  return (
    <div className="mt-6 rounded-xl border p-4">
      <h2 className="mb-4 text-lg font-semibold">Service Pricing</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            icon: <Phone />,
            price: "₹25/Min",
            label: "Audio Call",
          },
          {
            icon: <MessageSquare />,
            price: "₹18/Min",
            label: "Chat",
          },
          {
            icon: <Video />,
            price: "₹30/Min",
            label: "Video Call",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center rounded-xl border p-4 text-center"
          >
            <div className="mb-2 text-purple-600">{item.icon}</div>
            <p className="font-semibold">{item.price}</p>
            <p className="text-sm text-gray-500">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
