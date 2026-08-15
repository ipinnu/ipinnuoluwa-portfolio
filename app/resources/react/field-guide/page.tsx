import type { Metadata } from "next";
import FieldGuideLanding from "@/components/react-hub/FieldGuideLanding";

export const metadata: Metadata = {
  title: "The React Field Guide",
  description:
    "Focused React explanations, annotated examples, and interactive exercises for learning one concept at a time.",
};

export default function FieldGuidePage() {
  return <FieldGuideLanding />;
}
