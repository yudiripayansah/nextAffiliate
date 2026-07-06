import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/layout/Container";

export default function Section({ title, subtitle, viewAllHref, children, className }) {
  return (
    <section className={className}>
      <Container className="flex flex-col gap-4 py-10">
        {title ? (
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
              {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
            </div>
            {viewAllHref ? (
              <Link
                href={viewAllHref}
                className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Lihat Semua
                <ArrowRight className="size-4" />
              </Link>
            ) : null}
          </div>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
