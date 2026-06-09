import ConceptText from "./ConceptText";

interface ConceptSectionProps {
  paragraphs: string[];
}

export default function ConceptSection({ paragraphs }: ConceptSectionProps) {
  return (
    <div className="space-y-5 max-w-2xl">
      <div
        className="flex items-center gap-2 pb-4 border-b"
        style={{ borderColor: "rgba(163,196,180,0.15)" }}
      >
        <span
          className="font-mono text-[9px] tracking-widest uppercase"
          style={{ color: "#A3C4B4" }}
        >
          ✦ Tap any{" "}
          <span
            style={{
              textDecoration: "underline",
              textDecorationStyle: "dashed",
              textDecorationColor: "rgba(163,196,180,0.5)",
            }}
          >
            highlighted term
          </span>{" "}
          to learn more
        </span>
      </div>

      {paragraphs.map((para, i) => (
        <p
          key={i}
          className="text-text-secondary leading-relaxed text-[15px]"
        >
          <ConceptText text={para} />
        </p>
      ))}
    </div>
  );
}
