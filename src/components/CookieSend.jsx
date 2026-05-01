import React from "react";
export default function CookieSend({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      {/* Cookie shape */}
      <circle cx="16" cy="16" r="13" fill="#F97316"/>
      {/* Bite mark top-right */}
      <path d="M26 8C28 10 29 13 28 16" stroke="#FEF3E2" strokeWidth="3" strokeLinecap="round"/>
      {/* Chocolate chips */}
      <circle cx="12" cy="11" r="1.8" fill="#7C2D12" opacity="0.7"/>
      <circle cx="20" cy="14" r="1.5" fill="#7C2D12" opacity="0.7"/>
      <circle cx="15" cy="21" r="1.8" fill="#7C2D12" opacity="0.7"/>
      {/* Arrow in center */}
      <path d="M14 16L22 16M22 16L18 12M22 16L18 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
