import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/layout/Container";

export default function Section({ id, title, subtitle, viewAllHref, children, className }) {
  return (
    <section id={id} className={className}>
      <Container className="flex flex-col gap-4 py-10">
        {title ? (
          <div className="flex items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-9 w-1.5 shrink-0 rounded-full bg-brand" />
              <div>
                <h2 className="font-display text-xl font-bold sm:text-2xl">{title}</h2>
                {subtitle ? (
                  <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
                ) : null}
              </div>
            </div>
            {viewAllHref ? (
              <Link
                href={viewAllHref}
                className="flex shrink-0 items-center gap-1 rounded-full bg-secondary px-4 py-2 text-xs font-bold transition-colors hover:bg-accent"
              >
                Lihat Semua
                <ArrowRight className="size-3.5" />
              </Link>
            ) : null}
          </div>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
