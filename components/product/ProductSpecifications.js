export default function ProductSpecifications({ specifications }) {
  if (!specifications?.length) return null;

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">Spesifikasi</h2>
      <dl className="divide-y rounded-md border">
        {specifications.map((spec) => (
          <div key={spec.label} className="flex justify-between gap-4 px-4 py-2 text-sm">
            <dt className="text-muted-foreground">{spec.label}</dt>
            <dd className="text-right font-medium">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
