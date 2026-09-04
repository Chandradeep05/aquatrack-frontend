import React from 'react';

interface ObjectProps {
  className?: string;
  size?: number;
}

/**
 * Realistic Ceramic Cup (150ml)
 * Renders an elegant ceramic mug with glossy gradients, ergonomic handle, and fluid depth.
 */
export const RealisticCup: React.FC<ObjectProps> = ({ className = '', size = 48 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-md ${className}`}
    >
      <defs>
        {/* Ceramic Body Gradient */}
        <linearGradient id="cupCeramic" x1="12" y1="20" x2="48" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f1f5f9" />
          <stop offset="50%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        {/* Cup Inner Shadow */}
        <linearGradient id="cupInner" x1="16" y1="16" x2="44" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        {/* Coffee/Water Liquid Surface */}
        <radialGradient id="cupLiquid" cx="30" cy="20" r="14" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="70%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </radialGradient>
        {/* Handle Gradient */}
        <linearGradient id="cupHandle" x1="42" y1="22" x2="56" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
      </defs>

      {/* Handle */}
      <path
        d="M40 23 C 53 23, 56 43, 38 45"
        stroke="url(#cupHandle)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M40 26 C 49 26, 51 40, 38 42"
        stroke="#0f172a"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />

      {/* Main Cup Body */}
      <path
        d="M16 20 L20 50 C 20.5 53, 39.5 53, 40 50 L44 20 Z"
        fill="url(#cupCeramic)"
      />

      {/* Glossy Specular Highlight on Body */}
      <path
        d="M20 22 L23 49 C 24 49.5, 26 49.5, 27 49 L25 22 Z"
        fill="#ffffff"
        opacity="0.4"
      />

      {/* Base Footing Shadow */}
      <ellipse cx="30" cy="50.5" rx="10" ry="2" fill="#475569" opacity="0.6" />

      {/* Top Rim Outer & Inner Depth */}
      <ellipse cx="30" cy="20" rx="14" ry="4.5" fill="url(#cupInner)" />
      <ellipse cx="30" cy="20.5" rx="12.5" ry="3.8" fill="url(#cupLiquid)" />

      {/* Liquid Sheen */}
      <ellipse cx="31" cy="20" rx="6" ry="1.5" fill="#ffffff" opacity="0.5" />
    </svg>
  );
};

/**
 * Realistic Crystal Glass Tumbler (250ml)
 * Renders a tapered glass tumbler with transparent reflections, water level, and thick crystal base.
 */
export const RealisticGlass: React.FC<ObjectProps> = ({ className = '', size = 48 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-md ${className}`}
    >
      <defs>
        {/* Glass Outer Wall Gradient */}
        <linearGradient id="glassWall" x1="16" y1="14" x2="48" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.5" />
        </linearGradient>
        {/* Water Volume Gradient */}
        <linearGradient id="glassWater" x1="18" y1="26" x2="46" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0369a1" stopOpacity="0.95" />
        </linearGradient>
        {/* Heavy Glass Base Gradient */}
        <linearGradient id="glassBase" x1="22" y1="50" x2="42" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Glass Body Outer */}
      <path
        d="M17 14 L22 51 C 22.5 53.5, 41.5 53.5, 42 51 L47 14 Z"
        fill="url(#glassWall)"
        stroke="#7dd3fc"
        strokeWidth="1.2"
        strokeOpacity="0.6"
      />

      {/* Solid Thick Crystal Base */}
      <path
        d="M21.5 48 L22 51 C 22.5 53.5, 41.5 53.5, 42 51 L42.5 48 Z"
        fill="url(#glassBase)"
      />

      {/* Water Fill Column */}
      <path
        d="M18.8 26 L21.6 48 C 22.2 49.5, 41.8 49.5, 42.4 48 L45.2 26 Z"
        fill="url(#glassWater)"
      />

      {/* Water Surface Meniscus */}
      <ellipse cx="32" cy="26" rx="13.2" ry="3" fill="#7dd3fc" />
      <ellipse cx="32" cy="26" rx="11" ry="2" fill="#0284c7" />
      <ellipse cx="30" cy="25.5" rx="5" ry="1" fill="#ffffff" opacity="0.6" />

      {/* Vertical Glass Glare / Specular Highlight */}
      <path
        d="M21 16 L24 49 C 24.8 49.2, 26 49.2, 26.5 49 L23.5 16 Z"
        fill="#ffffff"
        opacity="0.45"
      />
      <path
        d="M41 16 L40 48"
        stroke="#ffffff"
        strokeWidth="1"
        strokeOpacity="0.3"
      />

      {/* Top Glass Rim */}
      <ellipse cx="32" cy="14" rx="15" ry="3.5" fill="none" stroke="#bae6fd" strokeWidth="1.2" />
    </svg>
  );
};

/**
 * Realistic Stainless Steel Sport Bottle (500ml)
 * Renders an ergonomic sport bottle with metallic sheen, threaded cap, and carry loop.
 */
export const RealisticBottle: React.FC<ObjectProps> = ({ className = '', size = 48 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-md ${className}`}
    >
      <defs>
        {/* Metallic Emerald Body Gradient */}
        <linearGradient id="bottleBody" x1="20" y1="22" x2="44" y2="55" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="40%" stopColor="#059669" />
          <stop offset="75%" stopColor="#047857" />
          <stop offset="100%" stopColor="#064e3b" />
        </linearGradient>
        {/* Stainless Steel Sheen */}
        <linearGradient id="metalSheen" x1="27" y1="22" x2="31" y2="55" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
        </linearGradient>
        {/* Screw Cap Gradient */}
        <linearGradient id="bottleCap" x1="26" y1="10" x2="38" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="50%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* Cap Carry Ring / Carabiner Loop */}
      <path
        d="M29 10 C 29 6, 35 6, 35 10"
        stroke="#94a3b8"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Screw Cap */}
      <rect x="27" y="10" width="10" height="6" rx="2" fill="url(#bottleCap)" />
      <line x1="28" y1="12" x2="36" y2="12" stroke="#94a3b8" strokeWidth="0.8" />
      <line x1="28" y1="14" x2="36" y2="14" stroke="#94a3b8" strokeWidth="0.8" />

      {/* Bottle Neck Ring */}
      <rect x="25" y="16" width="14" height="4" rx="1.5" fill="#475569" />

      {/* Main Bottle Body */}
      <path
        d="M25 20 C 23 23, 20 25, 20 30 L20 52 C 20 55, 44 55, 44 52 L44 30 C 44 25, 41 23, 39 20 Z"
        fill="url(#bottleBody)"
      />

      {/* Metallic Specular Highlight */}
      <path
        d="M24 23 C 23 25, 22 27, 22 30 L22 51 C 23 52, 25 52, 26 51 L26 28 C 26 26, 25 24, 24 23 Z"
        fill="url(#metalSheen)"
      />

      {/* Grip Groove Lines */}
      <line x1="22" y1="35" x2="42" y2="35" stroke="#047857" strokeWidth="1.5" opacity="0.6" />
      <line x1="22" y1="39" x2="42" y2="39" stroke="#047857" strokeWidth="1.5" opacity="0.6" />
      <line x1="22" y1="43" x2="42" y2="43" stroke="#047857" strokeWidth="1.5" opacity="0.6" />

      {/* Water Window Indicator */}
      <rect x="37" y="32" width="3" height="15" rx="1.5" fill="#022c22" />
      <rect x="37.5" y="36" width="2" height="10" rx="1" fill="#38bdf8" />
    </svg>
  );
};

/**
 * Realistic Insulated Hydro Flask (750ml)
 * Renders a powder-coated thermal vacuum flask with wide mouth, rigid handle, and silicone base boot.
 */
export const RealisticFlask: React.FC<ObjectProps> = ({ className = '', size = 48 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-md ${className}`}
    >
      <defs>
        {/* Deep Indigo/Purple Powder Coat */}
        <linearGradient id="flaskBody" x1="19" y1="20" x2="45" y2="55" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="40%" stopColor="#6366f1" />
          <stop offset="80%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#3730a3" />
        </linearGradient>
        {/* Silicone Base Boot */}
        <linearGradient id="flaskBoot" x1="19" y1="48" x2="45" y2="55" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#312e81" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
        {/* Lid Gradient */}
        <linearGradient id="flaskLid" x1="24" y1="12" x2="40" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>

      {/* Flexible Heavy-Duty Carry Handle */}
      <path
        d="M27 12 C 27 6, 37 6, 37 12"
        stroke="#334155"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M28 12 C 28 8, 36 8, 36 12"
        stroke="#64748b"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Wide Mouth Insulated Lid */}
      <rect x="25" y="12" width="14" height="6" rx="2" fill="url(#flaskLid)" />
      <rect x="24" y="17" width="16" height="3" rx="1" fill="#0f172a" />

      {/* Main Cylindrical Flask Body */}
      <rect x="19" y="20" width="26" height="32" rx="3" fill="url(#flaskBody)" />

      {/* Powder Coat Texture Reflection */}
      <path
        d="M22 21 L22 51 C 23.5 51.5, 25 51.5, 26 51 L26 21 Z"
        fill="#ffffff"
        opacity="0.25"
      />
      <line x1="41" y1="21" x2="41" y2="51" stroke="#312e81" strokeWidth="1" opacity="0.6" />

      {/* Protective Silicone Base Boot */}
      <path
        d="M19 46 L19 51 C 19 53.5, 45 53.5, 45 51 L45 46 Z"
        fill="url(#flaskBoot)"
      />
      <line x1="21" y1="49" x2="43" y2="49" stroke="#6366f1" strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
};

/**
 * Realistic Borosilicate Graduated Cylinder
 * Scientific laboratory-grade glass cylinder with graduation ticks, meniscus fluid, and glass reflections.
 */
interface CylinderProps {
  percentage: number;
  className?: string;
}

export const RealisticCylinder: React.FC<CylinderProps> = ({ percentage, className = '' }) => {
  const clampedPercent = Math.min(100, Math.max(0, percentage));
  const waterHeight = Math.max(8, (clampedPercent / 100) * 110);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        width="110"
        height="160"
        viewBox="0 0 110 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_8px_20px_rgba(6,182,212,0.25)]"
      >
        <defs>
          {/* Glass Cylinder Walls Gradient */}
          <linearGradient id="cylinderGlass" x1="30" y1="20" x2="80" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="70%" stopColor="#0ea5e9" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.3" />
          </linearGradient>

          {/* Fluid Water Column */}
          <linearGradient id="waterFluid" x1="35" y1="20" x2="75" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#0284c7" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>

          {/* Heavy Glass Pedestal Base */}
          <linearGradient id="pedestalBase" x1="20" y1="140" x2="90" y2="152" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="30%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Clip Path for the Inner Cylinder Tube */}
          <clipPath id="cylinderClip">
            <rect x="33" y="24" width="44" height="116" rx="6" />
          </clipPath>
        </defs>

        {/* Heavy Hexagonal / Round Glass Pedestal Base */}
        <ellipse cx="55" cy="144" rx="34" ry="7" fill="url(#pedestalBase)" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.6" />
        <ellipse cx="55" cy="142" rx="30" ry="5.5" fill="#090d16" opacity="0.7" />

        {/* Outer Cylinder Glass Tube */}
        <rect
          x="32"
          y="20"
          width="46"
          height="122"
          rx="7"
          fill="url(#cylinderGlass)"
          stroke="#7dd3fc"
          strokeWidth="1.5"
          strokeOpacity="0.5"
        />

        {/* Pouring Spout Lip at Top */}
        <path
          d="M29 21 L34 20 L34 23 Z"
          fill="#7dd3fc"
          opacity="0.7"
        />

        {/* Inner Fluid Reservoir with Clip */}
        <g clipPath="url(#cylinderClip)">
          {/* Dynamic Water Volume */}
          <rect
            x="33"
            y={140 - waterHeight}
            width="44"
            height={waterHeight + 4}
            fill="url(#waterFluid)"
            className="transition-all duration-1000 ease-out"
          />

          {/* Meniscus / Liquid Top Surface */}
          <ellipse
            cx="55"
            cy={140 - waterHeight}
            rx="21"
            ry="4.5"
            fill="#bae6fd"
            className="transition-all duration-1000 ease-out"
          />
          <ellipse
            cx="55"
            cy={140 - waterHeight}
            rx="18"
            ry="3"
            fill="#0284c7"
            className="transition-all duration-1000 ease-out"
          />

          {/* Water Specular Sheen Inside Column */}
          <rect
            x="36"
            y={140 - waterHeight}
            width="4"
            height={waterHeight}
            fill="#ffffff"
            opacity="0.3"
            className="transition-all duration-1000 ease-out"
          />
        </g>

        {/* Printed Measurement Graduation Lines */}
        <g stroke="#94a3b8" strokeWidth="1.2" opacity="0.8">
          {/* 100% Mark */}
          <line x1="66" y1="28" x2="74" y2="28" />
          <text x="82" y="31" fill="#94a3b8" fontSize="8" fontFamily="monospace" fontWeight="bold">100%</text>

          {/* 75% Mark */}
          <line x1="68" y1="56" x2="74" y2="56" />
          <text x="82" y="59" fill="#94a3b8" fontSize="8" fontFamily="monospace" fontWeight="bold">75%</text>

          {/* 50% Mark */}
          <line x1="66" y1="84" x2="74" y2="84" />
          <text x="82" y="87" fill="#94a3b8" fontSize="8" fontFamily="monospace" fontWeight="bold">50%</text>

          {/* 25% Mark */}
          <line x1="68" y1="112" x2="74" y2="112" />
          <text x="82" y="115" fill="#94a3b8" fontSize="8" fontFamily="monospace" fontWeight="bold">25%</text>

          {/* Minor Ticks */}
          <line x1="70" y1="42" x2="74" y2="42" opacity="0.5" strokeWidth="0.8" />
          <line x1="70" y1="70" x2="74" y2="70" opacity="0.5" strokeWidth="0.8" />
          <line x1="70" y1="98" x2="74" y2="98" opacity="0.5" strokeWidth="0.8" />
          <line x1="70" y1="126" x2="74" y2="126" opacity="0.5" strokeWidth="0.8" />
        </g>

        {/* Front Glass Reflection Highlights */}
        <path
          d="M35 22 L35 138"
          stroke="#ffffff"
          strokeWidth="1.8"
          strokeOpacity="0.4"
          strokeLinecap="round"
        />
        <path
          d="M73 24 L73 138"
          stroke="#ffffff"
          strokeWidth="0.8"
          strokeOpacity="0.2"
        />

        {/* Top Cylinder Rim Ellipse */}
        <ellipse cx="55" cy="21" rx="23" ry="3.5" fill="none" stroke="#e0f2fe" strokeWidth="1.4" />
      </svg>
    </div>
  );
};
