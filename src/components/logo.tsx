interface LogoIconProps {
  size?: number
  className?: string
}

/**
 * FaceUp.AI — gem/crystal icon inspired by premium SaaS design
 * A faceted diamond representing the "transformation" from ordinary to professional
 */
export function LogoIcon({ size = 36, className }: LogoIconProps) {
  const w = Math.round(size * 0.82)
  return (
    <svg
      width={w}
      height={size}
      viewBox="0 0 30 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Top crown — bright, catches the light */}
      <path d="M15 1 L29 13 L15 15.5 L1 13 Z" fill="#FFAB55" />

      {/* Left pavilion facet — medium orange */}
      <path d="M1 13 L15 15.5 L15 35 Z" fill="#FF7A1A" />

      {/* Right pavilion facet — darker, depth illusion */}
      <path d="M29 13 L15 15.5 L15 35 Z" fill="#D96608" />

      {/* Crown center highlight — subtle inner facet */}
      <path d="M15 1 L21.5 9 L15 15.5 L8.5 9 Z" fill="white" opacity="0.14" />

      {/* Top-left crown facet */}
      <path d="M1 13 L8.5 9 L15 1 L15 15.5 Z" fill="#FF8C2A" />

      {/* Top-right crown facet */}
      <path d="M29 13 L21.5 9 L15 1 L15 15.5 Z" fill="#FFBE75" />

      {/* Girdle line (crown/pavilion divide) — subtle light */}
      <line x1="1" y1="13" x2="29" y2="13" stroke="white" strokeWidth="0.5" opacity="0.35" />

      {/* Bottom tip highlight */}
      <circle cx="15" cy="34" r="1" fill="white" opacity="0.25" />
    </svg>
  )
}

interface LogoProps {
  size?: number
  dark?: boolean
  className?: string
  iconOnly?: boolean
}

export function Logo({ size = 34, dark = false, className, iconOnly = false }: LogoProps) {
  if (iconOnly) return <LogoIcon size={size} className={className} />
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ''}`}>
      <LogoIcon size={size} />
      <span
        className="font-black tracking-tight leading-none"
        style={{ fontSize: size * 0.59, color: dark ? 'white' : '#111111' }}
      >
        FaceUp<span style={{ color: '#FF7A1A' }}>.AI</span>
      </span>
    </span>
  )
}
