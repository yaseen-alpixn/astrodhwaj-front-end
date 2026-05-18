import { Eye, MoreVertical } from "lucide-react";

export default function WalletTransactions() {
  const data = [
    {
      type: "Recharge",
      status: "Completed",
      color: "bg-green-100 text-green-600",
    },
    {
      type: "Consultation",
      status: "Completed",
      color: "bg-purple-100 text-purple-600",
    },
    {
      type: "Recharge",
      status: "Closed",
      color: "bg-green-100 text-green-600",
    },
    {
      type: "Consultation",
      status: "Pending",
      color: "bg-purple-100 text-purple-600",
    },
    {
      type: "Withdrawals",
      status: "Completed",
      color: "bg-red-100 text-red-600",
    },
  ];

  return (
    <div className="w-full overflow-x-auto rounded-xl bg-white shadow-sm">
      <table className="min-w-[1300px] w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left text-sm md:text-[15px] font-medium whitespace-nowrap">
              Order ID
            </th>
            <th className="p-3 text-left text-sm md:text-[15px] font-medium whitespace-nowrap">
              User / Details
            </th>
            <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">
              Amount
            </th>
            <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">
              Method
            </th>
            <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">
              Type
            </th>
            <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">
              Status
            </th>
            <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">
              Date & Time
            </th>
            <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {Array(9)
            .fill(0)
            .map((_, i) => {
              const item = data[i % data.length];

              return (
                <tr
                  key={i}
                  className="border-b last:border-none text-sm md:text-[14px]"
                >
                  <td className="p-3 whitespace-nowrap">ORD26O3001</td>

                  <td className="p-3 whitespace-nowrap">Rahul Kumar</td>

                  <td className="p-3 text-center text-green-600 whitespace-nowrap">
                    +₹500
                  </td>

                  <td className="p-3 text-center whitespace-nowrap">UPI</td>

                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs md:text-sm whitespace-nowrap ${item.color}`}
                    >
                      {item.type}
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs md:text-sm whitespace-nowrap ${item.color}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="p-3 text-center whitespace-nowrap text-xs md:text-sm">
                    26 Mar, 2:30 PM
                  </td>

                  <td className="p-3">
                    <div className="flex justify-center items-center gap-3">
                      <Eye
                        size={18}
                        className="text-purple-600 cursor-pointer"
                      />
                      <MoreVertical size={18} className="cursor-pointer" />
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
