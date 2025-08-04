"use client";

import React, { useEffect, useState } from "react";
import { Bot } from "lucide-react";

export default function HighlightBubble() {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [selectedText, setSelectedText] = useState("");

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim() !== "") {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        setPosition({
          top: rect.top + window.scrollY - 40,
          left: rect.left + window.scrollX + rect.width / 2,
        });
        setSelectedText(selection.toString());
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("scroll", () => setVisible(false));

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("scroll", () => setVisible(false));
    };
  }, []);

  const handleClick = () => {
    alert(`AI triggered for: "${selectedText}"`);
    setVisible(false);
  };

  return visible ? (
    <div
      className="absolute z-50"
      style={{
        top: position.top,
        left: position.left,
        transform: "translate(-50%, -100%)",
      }}
    >
      <button
        onClick={handleClick}
        className="bg-white border shadow-md rounded-full p-2 hover:bg-gray-100 transition"
      >
        <Bot className="w-4 h-4 text-purple-600" />
      </button>
    </div>
  ) : null;
}
