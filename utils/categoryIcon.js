import {
  Smartphone,
  Tablet,
  Laptop,
  Shirt,
  Sparkles,
  Home,
  Cpu,
  UtensilsCrossed,
  Dumbbell,
  Watch,
  Camera,
  Headphones,
  Gamepad2,
  Baby,
  Car,
  Book,
  Gift,
  ShoppingBag,
  Tag,
} from "lucide-react";

const ICON_KEYWORDS = {
  smartphone: "smartphone",
  handphone: "smartphone",
  hp: "smartphone",
  phone: "smartphone",
  tablet: "tablet",
  laptop: "laptop",
  komputer: "laptop",
  computer: "laptop",
  fashion: "shirt",
  pakaian: "shirt",
  baju: "shirt",
  kecantikan: "sparkles",
  beauty: "sparkles",
  skincare: "sparkles",
  rumah: "home",
  home: "home",
  furniture: "home",
  elektronik: "cpu",
  electronic: "cpu",
  gadget: "cpu",
  makanan: "food",
  minuman: "food",
  food: "food",
  kuliner: "food",
  olahraga: "sport",
  sport: "sport",
  jam: "watch",
  watch: "watch",
  kamera: "camera",
  camera: "camera",
  audio: "audio",
  headphone: "audio",
  gaming: "gaming",
  game: "gaming",
  bayi: "baby",
  baby: "baby",
  otomotif: "car",
  automotive: "car",
  buku: "book",
  book: "book",
  hadiah: "gift",
  gift: "gift",
  tas: "bag",
  bag: "bag",
};

function getFallbackIconKey(category) {
  const key = (category.name || "").toLowerCase();
  const match = Object.keys(ICON_KEYWORDS).find((keyword) => key.includes(keyword));
  return match ? ICON_KEYWORDS[match] : "default";
}

function renderFallbackIcon(iconKey, style) {
  const props = { style, "aria-hidden": true };

  switch (iconKey) {
    case "smartphone":
      return <Smartphone {...props} />;
    case "tablet":
      return <Tablet {...props} />;
    case "laptop":
      return <Laptop {...props} />;
    case "shirt":
      return <Shirt {...props} />;
    case "sparkles":
      return <Sparkles {...props} />;
    case "home":
      return <Home {...props} />;
    case "cpu":
      return <Cpu {...props} />;
    case "food":
      return <UtensilsCrossed {...props} />;
    case "sport":
      return <Dumbbell {...props} />;
    case "watch":
      return <Watch {...props} />;
    case "camera":
      return <Camera {...props} />;
    case "audio":
      return <Headphones {...props} />;
    case "gaming":
      return <Gamepad2 {...props} />;
    case "baby":
      return <Baby {...props} />;
    case "car":
      return <Car {...props} />;
    case "book":
      return <Book {...props} />;
    case "gift":
      return <Gift {...props} />;
    case "bag":
      return <ShoppingBag {...props} />;
    default:
      return <Tag {...props} />;
  }
}

/**
 * Categories store a single emoji in `icon` (picked by the admin), which is
 * inherently full-color and distinct per category. Only fall back to a
 * keyword-matched line icon when no emoji has been set yet.
 */
export function renderCategoryIcon(category, sizePx = 28) {
  const icon = category.icon?.trim();

  if (icon) {
    return (
      <span
        role="img"
        aria-label={category.name}
        style={{ fontSize: sizePx, lineHeight: 1 }}
      >
        {icon}
      </span>
    );
  }

  return renderFallbackIcon(getFallbackIconKey(category), { width: sizePx, height: sizePx });
}
