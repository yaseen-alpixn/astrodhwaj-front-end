import { ChevronDown, Play, Video } from "lucide-react";

type CourseContentListProps = {
  items: string[];
};

export default function CourseContentList({ items }: CourseContentListProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <article
          key={item}
          className="flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-[#e8e1f1] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(69,34,119,0.04)]"
        >
          <div className="flex min-w-0 items-center gap-1 text-[#2c2c35]">
            <Video className="h-5 w-5 shrink-0" strokeWidth={2} />
            <span className="truncate text-[14px] font-semibold">{item}</span>
          </div>

          <div className="flex items-center gap-3 text-[#2c2c35]">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f3eff8] text-[#64606d]">
              <ChevronDown className="h-3 w-3" strokeWidth={2.2} />
            </span>
            <span className="inline-flex items-center gap-1.3 text-[11px] font-medium text-[#2c2c35]">
              <Play
                className="h-3 w-3 fill-[#7b18cb] text-[#7b18cb]"
                strokeWidth={1.9}
              />
              Preview
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
