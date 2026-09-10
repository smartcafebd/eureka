import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

interface EurekaLogoProps {
  className?: string;
  variant?: 'red' | 'white' | 'monochrome';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  animated?: boolean;
  animationType?: 'shimmer' | 'float' | 'pulse' | 'glow' | 'none';
}

export const EurekaLogo: React.FC<EurekaLogoProps> = ({
  className = '',
  variant = 'red',
  size = 'md',
  animated = true,
  animationType,
}) => {
  const { businessSettings } = useStore();
  const [imgError, setImgError] = useState(false);

  // Height presets for header, footer, mobile drawer, and invoice
  const heights = {
    sm: 28,
    md: 38,
    lg: 48,
    xl: 60,
    '2xl': 75,
  };

  const baseHeight = heights[size] || 38;
  const h = (size === 'md' && businessSettings?.logoHeight) ? businessSettings.logoHeight : baseHeight;

  // Determine logo source
  const customLogo = variant === 'white' 
    ? (businessSettings?.logoWhiteUrl || businessSettings?.logoUrl) 
    : businessSettings?.logoUrl;

  const defaultImageSrc = variant === 'white' ? '/eureka-logo-white.png' : '/eureka-logo.png';
  const effectiveSrc = (!imgError && customLogo) ? customLogo : defaultImageSrc;

  // Animation configuration
  const effectiveAnim = animationType || businessSettings?.logoAnimation || 'shimmer';
  const isAnimated = animated && effectiveAnim !== 'none';

  let animationClass = '';
  if (isAnimated) {
    if (effectiveAnim === 'float') {
      animationClass = 'animate-logo-float';
    } else if (effectiveAnim === 'pulse') {
      animationClass = 'animate-logo-pulse-smooth';
    } else if (effectiveAnim === 'glow') {
      animationClass = 'animate-logo-glow';
    }
  }

  return (
    <div
      className={`relative inline-flex items-center select-none overflow-hidden rounded-md transition-all duration-300 ease-out group/logo ${
        isAnimated ? 'hover:scale-105 active:scale-95' : ''
      } ${animationClass} ${className}`}
      style={{ height: `${h}px` }}
    >
      <img
        src={effectiveSrc}
        alt={businessSettings?.businessName || 'eureka logo'}
        className="h-full w-auto object-contain select-none block transition-all duration-300 group-hover/logo:brightness-105"
        style={{ height: `${h}px`, maxHeight: `${h}px` }}
        onError={() => setImgError(true)}
        referrerPolicy="no-referrer"
      />

      {/* Shimmer Light Ray Animation */}
      {isAnimated && (effectiveAnim === 'shimmer' || effectiveAnim === 'glow') && (
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 w-2/3 -skew-x-20 bg-gradient-to-r ${
            variant === 'white'
              ? 'from-transparent via-white/40 to-transparent'
              : 'from-transparent via-white/55 to-transparent'
          } animate-logo-shimmer`}
        />
      )}

      {/* Subtle luxury ambient sheen on hover */}
      {isAnimated && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 group-hover/logo:opacity-100 transition-opacity duration-300 rounded-md bg-gradient-to-tr from-transparent via-white/10 to-transparent"
        />
      )}
    </div>
  );
};





