export type ThemeColor = {
  primary: string;
  primaryHover: string;
  primaryLight: string;
};

export const defaultTheme: ThemeColor = {
  primary: 'rgb(37, 99, 235)', // blue-600
  primaryHover: 'rgb(29, 78, 216)', // blue-700
  primaryLight: 'rgb(219, 234, 254)', // blue-100
};

export function getThemeFromUrl(): ThemeColor {
  if (typeof window === 'undefined') return defaultTheme;
  
  const params = new URLSearchParams(window.location.search);
  const color = params.get('color');
  
  if (!color) return defaultTheme;
  
  try {
    const hex = color.startsWith('#') ? color : `#${color}`;
    const rgb = hexToRgb(hex);
    if (!rgb) return defaultTheme;
    
    return {
      primary: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      primaryHover: darken(rgb),
      primaryLight: lighten(rgb),
    };
  } catch {
    return defaultTheme;
  }
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function darken(rgb: { r: number; g: number; b: number }) {
  const factor = 0.8;
  return `rgb(${Math.round(rgb.r * factor)}, ${Math.round(rgb.g * factor)}, ${Math.round(rgb.b * factor)})`;
}

function lighten(rgb: { r: number; g: number; b: number }) {
  return `rgb(${Math.round(rgb.r + (255 - rgb.r) * 0.9)}, ${Math.round(rgb.g + (255 - rgb.g) * 0.9)}, ${Math.round(rgb.b + (255 - rgb.b) * 0.9)})`;
}