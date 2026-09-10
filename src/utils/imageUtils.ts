// Robust image sanitization, CDN error recovery, and fallback utilities

export const UNIVERSAL_FALLBACK_SHOES = {
  casual: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
  sneaker: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
  loafer: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=800&q=80',
  formal: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
  sandal: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80',
  default: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
};

// Foolproof inline SVG data URI in case external network blocks image CDN
export const SVG_FALLBACK_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <rect width="600" height="600" fill="#f8f7f5"/>
    <g transform="translate(150, 160)">
      <path d="M40 180 C80 180, 110 165, 140 135 C170 105, 210 90, 260 90 C280 90, 290 105, 285 125 C275 160, 240 180, 190 190 C120 205, 70 205, 30 200 Z" fill="#292524" opacity="0.9"/>
      <path d="M25 195 L285 195 C285 205, 275 215, 260 215 L40 215 C28 215, 25 205, 25 195 Z" fill="#e30613"/>
      <text x="150" y="260" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" fill="#57534e" text-anchor="middle">100% Genuine Leather</text>
      <text x="150" y="285" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#a8a29e" text-anchor="middle">Eureka Premium Footwear</text>
    </g>
  </svg>`
)}`;

/**
 * Returns a fallback image based on product category
 */
export function getCategoryFallback(category?: string): string {
  if (!category) return UNIVERSAL_FALLBACK_SHOES.default;
  const c = category.toLowerCase();
  if (c.includes('sandal') || c.includes('স্যান্ডেল')) return UNIVERSAL_FALLBACK_SHOES.sandal;
  if (c.includes('loafer') || c.includes('লোফার')) return UNIVERSAL_FALLBACK_SHOES.loafer;
  if (c.includes('formal') || c.includes('অফিস') || c.includes('ফরমাল')) return UNIVERSAL_FALLBACK_SHOES.formal;
  if (c.includes('sneaker') || c.includes('স্নিকার্স')) return UNIVERSAL_FALLBACK_SHOES.sneaker;
  if (c.includes('casual') || c.includes('ক্যাজুয়াল') || c.includes('cycle')) return UNIVERSAL_FALLBACK_SHOES.casual;
  return UNIVERSAL_FALLBACK_SHOES.default;
}

/**
 * Checks whether an image string is valid and not corrupted
 */
export function isValidImageUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  // Detect corrupted or truncated markers
  if (
    trimmed.includes('...[idb-vault]') ||
    trimmed.includes('[vault]') ||
    trimmed.includes('...[') ||
    trimmed.endsWith('...')
  ) {
    return false;
  }
  // If base64 or svg data URL, ensure it is complete and valid
  if (trimmed.startsWith('data:image/')) {
    if (trimmed.includes('svg+xml')) return trimmed.length > 50;
    return trimmed.length > 100 && trimmed.includes('base64,');
  }
  // Standard valid web or local path
  return (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('./') ||
    trimmed.startsWith('blob:')
  );
}

/**
 * Resolves a safe, non-broken image URL for any product
 */
export function getSafeProductImageUrl(
  imageCandidate?: string | null,
  category?: string,
  backupUrl?: string
): string {
  if (isValidImageUrl(imageCandidate)) {
    return imageCandidate!.trim();
  }
  if (isValidImageUrl(backupUrl)) {
    return backupUrl!.trim();
  }
  return getCategoryFallback(category);
}

/**
 * Ensures a product's images array has at least one valid, loadable image
 */
export function sanitizeProductImages(
  images?: (string | undefined | null)[],
  category?: string,
  seedImages?: string[]
): string[] {
  const validImages: string[] = [];
  if (Array.isArray(images)) {
    images.forEach((img) => {
      if (isValidImageUrl(img)) {
        validImages.push(img!.trim());
      }
    });
  }

  // If no valid images found, use seed fallback if provided
  if (validImages.length === 0 && Array.isArray(seedImages)) {
    seedImages.forEach((img) => {
      if (isValidImageUrl(img)) {
        validImages.push(img.trim());
      }
    });
  }

  // If still empty, return category fallback
  if (validImages.length === 0) {
    validImages.push(getCategoryFallback(category));
  }

  return validImages;
}

/**
 * Standard image onError handler to prevent broken image badges
 */
export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  category?: string,
  customFallback?: string
): void {
  const target = e.currentTarget;
  const fallback = customFallback || getCategoryFallback(category);

  // If already at the primary fallback, switch to inline SVG so it will never fail
  if (target.src === fallback || target.src.includes('images.unsplash.com')) {
    target.src = SVG_FALLBACK_IMAGE;
  } else {
    target.src = fallback;
  }
}
