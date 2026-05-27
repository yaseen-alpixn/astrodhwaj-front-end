export default function AboutSection({
  bio,
  experienceYears,
}: {
  bio?: string;
  experienceYears?: number;
}) {
  return (
    <div className="space-y-2 mt-10 lg:mt-0">
      <h2 className="font-semibold text-[18px] capitalize">About</h2>

      <p className="text-[13px] font-normal leading-[22px]">
        {bio || (
          <>
            Renowned palmist and Vastu expert with <b>{experienceYears ?? 18} years</b> of experience.
            Known for accurate palm readings and powerful remedies for life challenges.
          </>
        )}
      </p>
    </div>
  );
}
