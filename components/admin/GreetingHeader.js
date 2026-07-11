const GREETINGS = [
  { untilHour: 11, label: "Selamat pagi", emoji: "☀️" },
  { untilHour: 15, label: "Selamat siang", emoji: "🌤️" },
  { untilHour: 18, label: "Selamat sore", emoji: "🌇" },
  { untilHour: 24, label: "Selamat malam", emoji: "🌙" },
];

export default function GreetingHeader({ description }) {
  const now = new Date();
  const hour = Number(
    new Intl.DateTimeFormat("id-ID", { hour: "numeric", hour12: false, timeZone: "Asia/Jakarta" }).format(now)
  );
  const greeting = GREETINGS.find(({ untilHour }) => hour < untilHour) ?? GREETINGS[0];
  const dateLabel = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(now);

  return (
    <div className="flex flex-wrap items-end justify-between gap-2">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          {greeting.label} {greeting.emoji}
        </h1>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      <span className="rounded-full border border-dashed bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
        {dateLabel}
      </span>
    </div>
  );
}
