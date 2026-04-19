// components/ColorPicker.jsx
import React, { useMemo } from 'react';

export const colorSelector = {
  // Expanded & normalized (lowercase keys for safe lookup)
  purple: '#8434E1',
  black: '#252525',
  white: '#FFFFFF',
  gray: '#808080',
  grey: '#808080',
  blue: '#0000FF',
  red: '#FF0000',
  orange: '#FFA500',
  navy: '#000080',
  yellow: '#FFFF00',
  green: '#008000',
  pink: '#FF69B4',     // Added for your "Pink" variant
  // Add more colors as your catalog grows
  brown: '#A52A2A',
  beige: '#F5F5DC',
  teal: '#008080',
};

const ColorPicker = ({
  colors,
  selectedColor,
  onSelectColor,
  className = '',
  ringColor = 'purple-600', // customizable via prop
}) => {
  if (!colors || colors.length === 0) return null;

  // Helper to get hex (handles any casing from backend)
  const getColorHex = useMemo(() => {
    return (colorName) => {
      if (!colorName) return '#ccc';
      const key = colorName.toLowerCase().trim();
      return colorSelector[key] || colorName; // fallback to named color string (CSS-safe)
    };
  }, []);

  // Detect if a color is light → use dark checkmark for visibility
  const isLightColor = useMemo(() => {
    return (hex) => {
      if (!hex || hex.startsWith('rgb') || !hex.startsWith('#')) return false;
      const c = hex.replace('#', '');
      const rgb = parseInt(c, 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = rgb & 0xff;
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.73; // tuned for White, Yellow, light Pink, Beige etc.
    };
  }, []);

  return (
    <div
      className={`flex flex-wrap gap-3 ${className}`}
      role="radiogroup"
      aria-label="Product colors"
    >
      {colors.map((color) => {
        const hex = getColorHex(color);
        const isSelected = selectedColor === color;
        const lightBg = isLightColor(hex);

        return (
          <button
            key={color}
            onClick={() => onSelectColor(color)}
            role="radio"
            aria-checked={isSelected}
            aria-label={`Select ${color} color`}
            title={color}
            className={`group relative w-10 h-10 rounded-2xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-${ringColor} ${
              isSelected
                ? `ring-2 ring-offset-2 ring-${ringColor} scale-110 shadow-md`
                : 'hover:scale-110 active:scale-95'
            }`}
            style={{
              backgroundColor: hex,
              boxShadow: isSelected ? '0 0 0 4px rgba(255,255,255,0.3)' : 'none', // subtle inner glow on select
            }}
          >
            {/* Selected indicator */}
            {isSelected && (
              <span
                className={`absolute inset-0 flex items-center justify-center text-xs font-bold transition-colors ${
                  lightBg ? 'text-gray-900' : 'text-white'
                }`}
                style={{ textShadow: lightBg ? '0 0 2px rgba(255,255,255,0.6)' : 'none' }}
              >
                ✓
              </span>
            )}

            {/* Optional subtle border for better definition on light backgrounds */}
            <span
              className={`absolute inset-0 rounded-2xl border transition-colors ${
                isSelected ? 'border-white/40' : 'border-transparent group-hover:border-white/30'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default ColorPicker;