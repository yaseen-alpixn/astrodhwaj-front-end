import { numerologyForm } from "@/app/User/Numerology/numerologyData";

export default function NumerologyFormCard() {
  const ButtonIcon = numerologyForm.buttonIcon;

  return (
    <section className="rounded-[24px] border border-[#e5e7eb] bg-white px-5 py-6 shadow-[0_20px_60px_rgba(72,152,225,0.08)] sm:px-6 lg:px-8 lg:py-7">
      <h2 className="text-[18px] font-semibold tracking-[-0.03em] text-[#18171d]">
        {numerologyForm.title}
      </h2>

      <div className="mt-3 grid gap-5 lg:grid-cols-2">
        {numerologyForm.fields.map(
          ({ label, placeholder, type, icon: Icon }) => (
            <label key={label} className="block">
              <span className="mb-2.5 block text-[14px] font-medium text-[#25242b]">
                {label}
              </span>
              <span className="flex h-11 items-center rounded-[14px] border border-black/25 bg-white px-4">
                <input
                  type={type}
                  placeholder={placeholder}
                  className="w-full bg-transparent text-[13px] font-normal text-[#1d1d1d] outline-none placeholder:text-[#7d7886]"
                />
                {Icon ? (
                  <Icon
                    className="h-5 w-5 shrink-0 text-[#6f6778]"
                    strokeWidth={2}
                  />
                ) : null}
              </span>
            </label>
          ),
        )}
      </div>

      <div className="mt-5 flex justify-center">
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[12px] bg-[#DD9A29] px-7 py-3 text-[13px] font-medium text-white shadow-[0_14px_30px_rgba(246,201,0,0.24)] transition-transform hover:translate-y-[-1px] sm:min-w-[264px]"
        >
          <ButtonIcon className="h-5 w-5" strokeWidth={2.2} />
          <span>{numerologyForm.buttonLabel}</span>
        </button>
      </div>
    </section>
  );
}
