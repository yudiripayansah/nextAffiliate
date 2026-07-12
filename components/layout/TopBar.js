import Link from "next/link";
import Container from "@/components/layout/Container";

const TOP_LINKS = [
  { label: "Tentang", href: "/about" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Privasi", href: "/privacy" },
];

export default function TopBar() {
  return (
    <div className="hidden bg-primary text-primary-foreground lg:block dark:bg-card dark:text-card-foreground">
      <Container className="flex h-9 items-center justify-between text-xs">
        <nav className="flex items-center gap-4">
          {TOP_LINKS.map(({ label, href }) => (
            <Link key={href} href={href} className="opacity-85 transition-opacity hover:opacity-100">
              {label}
            </Link>
          ))}
        </nav>
        <p className="font-semibold"><span aria-hidden="true">✦</span> Belanja hemat dari Shopee, Tokopedia &amp; TikTok Shop</p>
      </Container>
    </div>
  );
}
