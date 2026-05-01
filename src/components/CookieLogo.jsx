export default function CookieLogo({ size = 32, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      {/* Cookie base */}
      <path d="M32 4C16.536 4 4 16.536 4 32s12.536 28 28 28c13.44 0 24.67-9.45 27.44-22.04C58.2 38.8 56 40 53.5 40c-2.5 0-4.5-2-4.5-4.5S51 31 53.5 31c1.38 0 2.6.62 3.44 1.59C58.98 29.54 60 26.37 60 22.5 60 10.07 47.93 4 32 4z" fill="#F97316"/>
      {/* Bite mark */}
      <path d="M32 4C16.536 4 4 16.536 4 32s12.536 28 28 28c13.44 0 24.67-9.45 27.44-22.04C58.2 38.8 56 40 53.5 40c-2.5 0-4.5-2-4.5-4.5S51 31 53.5 31c1.38 0 2.6.62 3.44 1.59C58.98 29.54 60 26.37 60 22.5 60 10.07 47.93 4 32 4z" fill="none" stroke="#EA580C" strokeWidth="0.5"/>
      {/* Inner shadow for bite */}
      <path d="M60 22.5C60 26.37 58.98 29.54 56.94 32.59 56.1 31.62 54.88 31 53.5 31c-2.5 0-4.5 2-4.5 4.5S51 40 53.5 40c2.5 0 4.7-1.2 5.94-2.04C56.67 50.55 45.44 60 32 60 16.536 60 4 47.464 4 32S16.536 4 32 4" fill="#EA580C" opacity="0.15"/>
      {/* Chocolate chips */}
      <ellipse cx="20" cy="18" rx="3.5" ry="3" fill="#7C2D12" opacity="0.8"/>
      <ellipse cx="38" cy="14" rx="3" ry="2.5" fill="#7C2D12" opacity="0.8"/>
      <ellipse cx="14" cy="34" rx="3.5" ry="3" fill="#7C2D12" opacity="0.8"/>
      <ellipse cx="42" cy="28" rx="3" ry="2.5" fill="#7C2D12" opacity="0.8"/>
      <ellipse cx="28" cy="42" rx="3.5" ry="3" fill="#7C2D12" opacity="0.8"/>
      <ellipse cx="48" cy="44" rx="2.5" ry="2" fill="#7C2D12" opacity="0.8"/>
      <ellipse cx="24" cy="26" rx="2.5" ry="2" fill="#7C2D12" opacity="0.7"/>
      {/* Cookie texture */}
      <circle cx="30" cy="22" r="0.8" fill="#FDE68A" opacity="0.6"/>
      <circle cx="18" cy="40" r="0.8" fill="#FDE68A" opacity="0.6"/>
      <circle cx="44" cy="36" r="0.8" fill="#FDE68A" opacity="0.6"/>
    </svg>
  );
}
