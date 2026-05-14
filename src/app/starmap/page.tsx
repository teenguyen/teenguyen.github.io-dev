import type { Metadata } from "next";
import StarmapView from "./StarmapView";

export const metadata: Metadata = {
  title: "Starmap — Theresa Nguyen",
};

export default function StarmapPage() {
  return <StarmapView />;
}
