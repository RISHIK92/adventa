"use client";

import React from "react";
import Latex from "react-latex-next";

interface CiteBlock {
  text: string;
  cites: string[];
}

function parseCitations(content: string): CiteBlock[] {
  const parts: CiteBlock[] = [];
  //@ts-ignore
  const regex = /\[cite_start\](.*?)\[cite:([^\]]+)\]/gs;
  let match;
  let lastIndex = 0;

  while ((match = regex.exec(content)) !== null) {
    // Push plain text before this cite block
    if (match.index > lastIndex) {
      parts.push({ text: content.slice(lastIndex, match.index), cites: [] });
    }

    // Push cite block
    const claim = match[1].trim();
    const cites = match[2].split(",").map((c) => c.trim());
    parts.push({ text: claim, cites });

    lastIndex = regex.lastIndex;
  }

  // Push remaining plain text
  if (lastIndex < content.length) {
    parts.push({ text: content.slice(lastIndex), cites: [] });
  }

  return parts;
}

export default function RenderWithCitations({ text }: { text: string }) {
  const parts = parseCitations(text);

  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          <Latex>{part.text}</Latex>
          {part.cites.length > 0 &&
            part.cites.map((c, j) => (
              <sup key={j} className="text-blue-500 cursor-pointer ml-1">
                [{c}]
              </sup>
            ))}
        </span>
      ))}
    </>
  );
}
