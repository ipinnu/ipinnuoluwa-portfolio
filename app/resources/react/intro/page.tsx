import { Metadata } from "next";
import WebHistory from "@/components/react-hub/WebHistory";

export const metadata: Metadata = {
  title: "The Web Before React · React Hub",
  description:
    "From Tim Berners-Lee's first web page in 1991 to Facebook's notification bug in 2011 — the full story of how React came to exist.",
};

export default function IntroPage() {
  return <WebHistory />;
}
