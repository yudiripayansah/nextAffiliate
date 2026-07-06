export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parsePrice(text) {
  if (typeof text === "number") return text;
  if (!text) return null;

  const digitsOnly = text.toString().replace(/[^\d]/g, "");
  return digitsOnly ? Number(digitsOnly) : null;
}

export function generateSeoTitle(title) {
  return title?.trim().slice(0, 60) ?? "";
}

export function generateSeoDescription(title, description) {
  const base = description || title || "";
  return base.trim().slice(0, 160);
}

export function generateTags(title) {
  if (!title) return [];

  return Array.from(
    new Set(
      title
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => word.length > 2)
    )
  ).slice(0, 8);
}
