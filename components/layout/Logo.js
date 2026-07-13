import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Logo({ siteName, logoUrl, className, markClassName }) {
  if (logoUrl) {
    return (
      <span className={cn("relative block h-8 w-36 lg:h-10 lg:w-44", className)}>
        <Image src={logoUrl} alt={siteName} fill sizes="180px" className="object-contain object-left" />
      </span>
    );
  }

  return (
    <span className={cn("flex items-center gap-1.5", className)}>
      <span aria-hidden="true" className={markClassName}>✦</span>
      <span className="font-display font-bold">{siteName}</span>
    </span>
  );
}
