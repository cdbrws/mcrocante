import React from "react";
export default function AiaIcon({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Sparkle main shape */}
      <path d="M24 4L26.5 16.5L39 14L31.5 24L39 34L26.5 31.5L24 44L21.5 31.5L9 34L16.5 24L9 14L21.5 16.5L24 4Z" fill="#F97316" stroke="#EA580C" strokeWidth="1.5" strokeLinejoin="round"/>
      {/* Inner glow */}
      <circle cx="24" cy="24" r="6" fill="#FFF7ED"/>
      <circle cx="24" cy="24" r="4" fill="#F97316"/>
      <circle cx="22" cy="22" r="1.5" fill="white" opacity="0.8"/>
    </svg>
  );
}
