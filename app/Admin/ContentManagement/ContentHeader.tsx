// components/content/Header.tsx
import { Plus } from "lucide-react";
import ExportButton from "../CommonComponents/ExportButton";
export default function ContentHeader() {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div>
        <h1 className="text-[28px] font-semibold">Content Management</h1>
        <p className="text-[14px] font-medium text-gray-500 mt-1">
          Manage horoscopes, blogs, and articles
        </p>
      </div>

      <ExportButton name="Create Content" type="add" />
    </div>
  );
}
