import Script from "next/script";

export default function JsonLd({ data, id }) {
  return (
    <Script
      id={id || `jsonld-${data["@type"]}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
