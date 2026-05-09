// Custom 3D cartoon-style SVG icons. Non-mainstream, dynamic gradients.
import type { SVGProps } from "react";

const Defs = ({ id }: { id: string }) => (
  <defs>
    <linearGradient id={`${id}-grad`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#7DD3FC" />
      <stop offset="60%" stopColor="#0098EA" />
      <stop offset="100%" stopColor="#0F62FE" />
    </linearGradient>
    <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
    </linearGradient>
    <radialGradient id={`${id}-rim`} cx="0.5" cy="0.5" r="0.5">
      <stop offset="80%" stopColor="#0F62FE" stopOpacity="0" />
      <stop offset="100%" stopColor="#0F62FE" stopOpacity="0.5" />
    </radialGradient>
  </defs>
);

export const RocketIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 64 64" {...p}>
    <Defs id="rk" />
    <path d="M32 4c10 6 16 18 16 30l-6 8H22l-6-8C16 22 22 10 32 4z" fill="url(#rk-grad)" />
    <circle cx="32" cy="26" r="6" fill="#0a1628" />
    <circle cx="30" cy="24" r="2" fill="#7DD3FC" />
    <path d="M22 42l-6 12 12-4M42 42l6 12-12-4" fill="#0F62FE" />
    <path d="M28 8c2-2 6-2 8 0-1 4-3 8-4 10-1-2-3-6-4-10z" fill="url(#rk-shine)" opacity="0.7" />
  </svg>
);

export const DiamondCoinIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 64 64" {...p}>
    <Defs id="dc" />
    <polygon points="32,4 60,28 32,60 4,28" fill="url(#dc-grad)" />
    <polygon points="32,4 60,28 32,28" fill="#7DD3FC" opacity="0.85" />
    <polygon points="32,4 4,28 32,28" fill="#ffffff" opacity="0.55" />
    <polygon points="32,28 60,28 32,60" fill="#0F62FE" opacity="0.4" />
  </svg>
);

export const TrophyOrbIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 64 64" {...p}>
    <Defs id="tr" />
    <ellipse cx="32" cy="56" rx="18" ry="4" fill="#0F62FE" opacity="0.25" />
    <path d="M14 14h36v10c0 10-8 18-18 18S14 34 14 24V14z" fill="url(#tr-grad)" />
    <path d="M18 18h28v6c0 8-6 14-14 14S18 32 18 24v-6z" fill="#ffffff" opacity="0.25" />
    <rect x="26" y="42" width="12" height="6" rx="2" fill="#0F62FE" />
    <rect x="22" y="48" width="20" height="6" rx="3" fill="url(#tr-grad)" />
    <circle cx="22" cy="14" r="6" fill="#7DD3FC" />
    <circle cx="42" cy="14" r="6" fill="#7DD3FC" />
  </svg>
);

export const PixieIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 64 64" {...p}>
    <Defs id="px" />
    <path d="M14 30c-6-2-10 6-4 10 4 2 8-2 8-2M50 30c6-2 10 6 4 10-4 2-8-2-8-2" fill="#7DD3FC" opacity="0.7" />
    <circle cx="32" cy="34" r="18" fill="url(#px-grad)" />
    <circle cx="32" cy="34" r="18" fill="url(#px-rim)" />
    <circle cx="26" cy="32" r="3.5" fill="#fff" />
    <circle cx="38" cy="32" r="3.5" fill="#fff" />
    <circle cx="26" cy="33" r="1.8" fill="#0a1628" />
    <circle cx="38" cy="33" r="1.8" fill="#0a1628" />
    <path d="M26 40c2 3 10 3 12 0" stroke="#0a1628" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M22 18l4 6M42 18l-4 6M32 14v8" stroke="#0F62FE" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const FriendsIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 64 64" {...p}>
    <Defs id="fr" />
    <circle cx="22" cy="24" r="10" fill="url(#fr-grad)" />
    <circle cx="44" cy="22" r="8" fill="#7DD3FC" />
    <path d="M6 52c2-10 12-16 18-16s14 6 16 14H6z" fill="url(#fr-grad)" />
    <path d="M38 50c2-7 8-12 14-12 4 0 8 4 8 8v4H38z" fill="#7DD3FC" />
  </svg>
);

export const CheckBurstIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 64 64" {...p}>
    <Defs id="cb" />
    <path d="M32 4l6 6 8-2 2 8 8 4-4 8 4 8-8 4-2 8-8-2-6 6-6-6-8 2-2-8-8-4 4-8-4-8 8-4 2-8 8 2z" fill="url(#cb-grad)" />
    <path d="M22 32l8 8 14-16" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export const BoltIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 64 64" {...p}>
    <Defs id="bl" />
    <path d="M36 4L12 36h14l-4 24 24-32H32l4-24z" fill="url(#bl-grad)" />
    <path d="M36 4L12 36h14l-2 12 16-22H32l4-22z" fill="#fff" opacity="0.35" />
  </svg>
);

export const GamepadOrbIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 64 64" {...p}>
    <Defs id="gp" />
    <path d="M14 22h36c6 0 10 4 10 10v8c0 6-4 10-10 10-4 0-6-2-8-4l-4-4H22l-4 4c-2 2-4 4-8 4-6 0-10-4-10-10v-8c0-6 4-10 10-10z" fill="url(#gp-grad)" />
    <circle cx="44" cy="32" r="3" fill="#7DD3FC" />
    <circle cx="52" cy="36" r="3" fill="#fff" />
    <rect x="14" y="32" width="10" height="3" rx="1.5" fill="#fff" />
    <rect x="17.5" y="28.5" width="3" height="10" rx="1.5" fill="#fff" />
  </svg>
);
