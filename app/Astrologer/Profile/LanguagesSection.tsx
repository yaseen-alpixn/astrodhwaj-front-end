export default function LanguagesSection({ languages }: { languages?: string[] }) {
  const langs = languages && languages.length > 0 ? languages : ["Hindi", "English", "Sanskrit"];

  return (
    <div className="space-y-2">
      <h2 className="font-[DM_Sans] font-semibold text-[18px] capitalize">
        Languages
      </h2>

      <div className="flex gap-2">
        {langs.map((lang, i) => (
          <div
            key={i}
            className="h-[37px] px-[15px] py-[8px] text-[11px] font-medium rounded-[5px] bg-gray-300 flex items-center"
          >
            {lang}
          </div>
        ))}
      </div>
    </div>
  );
}
