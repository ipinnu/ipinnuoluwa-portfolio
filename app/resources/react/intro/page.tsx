import type { Metadata } from "next";
import CourseIntro from "@/components/react-hub/CourseIntro";

export const metadata: Metadata = {
  title: "Start Here · React Hub",
  description:
    "Create a learner account, explore the web from first principles, and build one real project across ten connected modules.",
};

export default function IntroPage() {
  return <CourseIntro />;
}
