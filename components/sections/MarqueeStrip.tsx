const items = [
  "Autodrive",
  "My Health Padi",
  "iNSDEC",
  "HermexTravels",
  "Flutter",
  "Firebase",
  "AWS",
  "React Native",
  "Next.js",
  "Supabase",
  "TypeScript",
  "Bloc",
];

export default function MarqueeStrip() {
  const doubled = [...items, ...items];

  return (
    <div className="border-y border-border overflow-hidden py-4 my-0">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 font-mono text-sm text-text-tertiary px-6"
          >
            {item}
            <span className="text-text-tertiary">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
