function tokenize(text) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

export function buildSearchKeywords({ title = "", slug = "", brand = "", tags = [] }) {
  const tokens = new Set([
    ...tokenize(title),
    ...tokenize(slug),
    ...tokenize(brand),
    ...tags.flatMap((tag) => tokenize(tag)),
  ]);

  return Array.from(tokens);
}
