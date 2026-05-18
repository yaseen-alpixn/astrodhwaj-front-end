import Image from "next/image";
const cards = [
  {
    title: "Total Tickets",
    src: "/images/Support1.png",
    value: 5,
    color: "bg-[#4898E1]/10",
  },
  {
    title: "Open Tickets",
    src: "/images/Support2.png",
    value: 2,
    color: "bg-blue-100",
  },
  {
    title: "In Progress",
    src: "/images/Support3.png",
    value: 2,
    color: "bg-yellow-100",
  },
  {
    title: "Closed",
    src: "/images/Support4.png",
    value: 1,
    color: "bg-green-100",
  },
];

export default function SupportAndTicketSystemStatsCard() {
  return (
    <div className="grid grid-cols-1 gap-3 mb-6 sm:grid-cols-2 lg:grid-cols-4 lg:max-w-[800px] xl:max-w-full">
      {cards.map((card, i) => (
        <div
          key={i}
          className="h-[130px] w-full rounded-2xl bg-white p-3 shadow-sm flex flex-col justify-between"
        >
          <div className={`w-[40px] h-[40px] rounded-lg ${card.color} flex items-center justify-center`}>
            <Image src={card.src} width={15} height={15} alt={card.title + " icon"} />
          </div>

          <div>
            <h2 className="text-[20px] font-medium">{card.value}</h2>

            <p className="text-[14px] font-medium">{card.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
