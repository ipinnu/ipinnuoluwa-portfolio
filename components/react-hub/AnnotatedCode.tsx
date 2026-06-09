import { ExampleHighlight } from "@/lib/react-hub/curriculum";

interface AnnotatedCodeProps {
  code: string;
  highlights: ExampleHighlight[];
}

export default function AnnotatedCode({ code, highlights }: AnnotatedCodeProps) {
  const lines = code.split("\n");
  const hintMap = new Map(highlights.map((h) => [h.line, h.hint]));

  return (
    <div className="overflow-hidden border border-border">
      {/* Header */}
      <div className="px-4 py-2 bg-bg-secondary border-b border-border flex items-center justify-between">
        <span className="font-mono text-[10px] text-accent tracking-widest uppercase">
          Example
        </span>
        <span className="font-mono text-[10px] text-text-tertiary">
          read-only · highlighted lines explained below
        </span>
      </div>

      {/* Code */}
      <div className="bg-bg-primary overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: "100%" }}>
          <tbody>
            {lines.map((line, i) => {
              const lineNum = i + 1;
              const hint = hintMap.get(lineNum);
              const isHighlighted = !!hint;

              return (
                <>
                  <tr
                    key={`line-${lineNum}`}
                    style={
                      isHighlighted
                        ? { backgroundColor: "rgba(232,255,71,0.04)" }
                        : {}
                    }
                  >
                    {/* Line number */}
                    <td
                      className="select-none text-right pr-4 pl-4 font-mono text-[11px] text-text-tertiary align-top"
                      style={{
                        width: "2.5rem",
                        minWidth: "2.5rem",
                        paddingTop: "0.375rem",
                        paddingBottom: isHighlighted ? "0.25rem" : "0.375rem",
                        color: isHighlighted ? "rgba(232,255,71,0.5)" : undefined,
                        userSelect: "none",
                      }}
                    >
                      {lineNum}
                    </td>

                    {/* Left accent bar on highlighted lines */}
                    <td
                      className="align-top"
                      style={{
                        width: "2px",
                        minWidth: "2px",
                        padding: 0,
                        backgroundColor: isHighlighted ? "#E8FF47" : "transparent",
                        boxShadow: isHighlighted ? "0 0 6px #E8FF4780" : "none",
                      }}
                    />

                    {/* Code line */}
                    <td
                      className="pl-4 pr-6 font-mono text-sm text-text-primary align-top whitespace-pre"
                      style={{
                        paddingTop: "0.375rem",
                        paddingBottom: isHighlighted ? "0.25rem" : "0.375rem",
                      }}
                    >
                      {line || " "}
                    </td>
                  </tr>

                  {/* Hint row — appears directly below the highlighted line */}
                  {isHighlighted && (
                    <tr
                      key={`hint-${lineNum}`}
                      style={{ backgroundColor: "rgba(232,255,71,0.04)" }}
                    >
                      <td />
                      <td
                        style={{
                          width: "2px",
                          backgroundColor: "#E8FF4730",
                          padding: 0,
                        }}
                      />
                      <td
                        className="pl-4 pr-6 pb-3 font-mono text-[11px] leading-snug"
                        style={{ color: "rgba(232,255,71,0.7)" }}
                      >
                        ↳ {hint}
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
