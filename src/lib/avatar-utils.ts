/**
 * Utility functions for handling avatar images with fallbacks
 */

/**
 * Generates a fallback avatar SVG with initials
 */
export function generateInitialsAvatar(name: string, size: number = 36): string {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <rect width="${size}" height="${size}" fill="#611f69"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial" font-size="${Math.max(12, size * 0.35)}" font-weight="bold">${initials}</text>
    </svg>`
  )}`;
}

/**
 * Creates an error handler for avatar images that falls back to initials
 */
export function createAvatarErrorHandler(name: string, size: number = 36) {
  return (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    if (!target.src.startsWith('data:')) {
      target.src = generateInitialsAvatar(name, size);
    }
  };
}
