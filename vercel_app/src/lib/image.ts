export function resolveImageUrl(image?: string | null) {
  if (!image) return "/images/apartment-default.svg";
  if (/^https?:\/\//i.test(image)) return image;
  if (image.startsWith("/")) return image;
  return `/${image}`;
}
