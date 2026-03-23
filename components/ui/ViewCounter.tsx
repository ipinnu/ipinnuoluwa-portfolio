"use client";

import { useEffect, useState } from "react";

interface ViewCounterProps {
  slug: string;
}

export default function ViewCounter({ slug }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    // Increment view count
    fetch(`/api/views/${slug}`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (data.views !== undefined) {
          setViews(data.views);
        }
      })
      .catch(() => {
        // Silently fail — view count is non-critical
      });
  }, [slug]);

  if (views === null) return null;

  return (
    <span className="font-mono text-xs text-text-tertiary">
      {views.toLocaleString()} views
    </span>
  );
}
