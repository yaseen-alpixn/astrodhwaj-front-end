export const kundaliTabs = ["Chart", "Planets", "Dasha", "Dosha"];

export const dashaCards = [
  {
    title: "Jupiter (Guru) Mahadasha",
    range: "2020 - 2036",
    badge: "Current",
  },
  {
    title: "Jupiter - Venus Antardasha",
    range: "May 2024 - Nov 2026",
    badge: "Current",
  },
  {
    title: "Jupiter - Sun Antardasha",
    range: "Nov 2026 - Sep 2027",
  },
];

export const doshaCards = [
  {
    title: "Mangal Dosha",
    text: "No Mangal Dosha Found",
    badge: "None",
    tone: "green",
  },
  {
    title: "Kaal Sarp Dosha",
    text: "No Kaal Sarp Dosha Detected",
    badge: "None",
    tone: "green",
  },
  {
    title: "Pitra Dosha",
    text: "Mild Pitra Dosha Present, Remedies Suggested",
    badge: "Mild",
    tone: "yellow",
  },
] as const;

export const remedyPoints = [
  "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit.",
  "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit.",
  "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit.",
];

export const planetStrengths = [
  "Sun (Surya)",
  "Moon (Chandra)",
  "Mars (Mangal)",
  "Mercury (Budh)",
  "Jupiter (Guru)",
  "Venus (Shukra)",
  "Saturn (Shani)",
  "Rahu",
  "Ketu",
].map((title) => ({
  title,
  subtitle: "Leo • 5th House • 15°24'",
  strength: 85,
}));

export const compatibilityTraits = [
  { title: "Varna (Caste)", score: "1/1", match: 100, tone: "green" },
  { title: "Varna (Caste)", score: "1/1", match: 81, tone: "yellow" },
  { title: "Varna (Caste)", score: "1/1", match: 100, tone: "green" },
  { title: "Varna (Caste)", score: "1/1", match: 89, tone: "yellow" },
  { title: "Varna (Caste)", score: "1/1", match: 100, tone: "green" },
  { title: "Varna (Caste)", score: "1/1", match: 81, tone: "yellow" },
  { title: "Varna (Caste)", score: "1/1", match: 100, tone: "green" },
  { title: "Varna (Caste)", score: "1/1", match: 100, tone: "green" },
] as const;

export const summaryCards = [
  {
    title: "User",
    heading: "Non-Manglik",
    note: "Severity: None",
    tone: "green",
  },
  {
    title: "Date of Birth",
    heading: "Severity: Low",
    note: "Severity: None",
    tone: "red",
  },
  {
    title: "Compatible",
    heading: "Low Mangal Dosha in partner can be balanced",
    note: "through simple remedies",
    tone: "green",
  },
] as const;
