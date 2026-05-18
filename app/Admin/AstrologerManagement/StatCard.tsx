// components/user/StatCard.tsx
import Image from "next/image";

type StatCardProps = {
  src: string;
  value: string;
  label: string;
  bg: string;
};

export default function StatCard({ src, value, label, bg }: StatCardProps) {
  return (
    <div className="h-[125px] shadow-sm w-full rounded-2xl bg-white p-3 flex flex-col justify-between">
      <div className={`w-[40px] h-[40px] rounded-lg ${bg} flex items-center justify-center`}>
        <Image
          src={src}
          width={15}
          height={15}
          alt={label + " icon"}
          className="object-cover"
        />
      </div>

      <div>
        <h2 className="text-[20px] font-medium">{value}</h2>
        <p className="text-[14px] font-medium">{label}</p>
      </div>
    </div>
  );
}
