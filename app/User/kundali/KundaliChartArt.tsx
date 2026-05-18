import Image from "next/image";
type KundaliChartArtProps = {
  variant?: "lagna" | "chandra";
};

export default function KundaliChartArt({
  variant = "lagna",
}: KundaliChartArtProps) {
  const centerLabel =
    variant === "lagna" ? ["Rising", "Ascendant"] : ["Moon", "Ascendant"];

  return (
    <div className="rounded-[12px] bg-[linear-gradient(90deg,#CCF7FF_0%,#E1E6FF_100%)] p-6 flex justify-center">
      <Image
        src="/images/ChakraImage.png"
        height={220}
        width={220}
        alt="Kundali chart illustration"
        className="object-contain"
      />
    </div>
  );
}
