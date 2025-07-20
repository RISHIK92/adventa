"use client";

import { useParams } from "next/navigation";

export default function PYQYearPage() {
  const params = useParams();
  const { year } = params;
  return <div>Previous Year Questions for {year} will appear here.</div>;
}
