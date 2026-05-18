import Image from "next/image";

const roles = [
  {
    title: "Super Admin",
    desc: "Full system access and control",
  },
  {
    title: "Finance Admin",
    desc: "Manage financial transactions and payouts",
  },
  {
    title: "Support Admin",
    desc: "Handle user support and tickets",
  },
];

export default function RoleCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 p-2 xl:max-w-full">
      {roles.map((role, i) => (
        <div
          key={i}
          className="min-h-[170px] p-4 bg-white rounded-xl shadow-sm flex flex-col justify-between"
        >
          {/* Top */}
          <div className="w-12 h-12 bg-purple-100 flex items-center justify-center rounded-xl">
            <Image
              src="/images/permission.png"
              width={22}
              height={22}
              alt="permission"
            />
          </div>

          {/* Content */}
          <div className="mt-4">
            <h3 className="text-sm md:text-[15px] font-semibold">
              {role.title}
            </h3>

            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              {role.desc}
            </p>

            <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
              👥 2 users
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
