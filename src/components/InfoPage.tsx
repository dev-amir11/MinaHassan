function PageShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="eyebrow">Mina Hasan</p>
      <h1 className="mt-2 font-serif text-4xl italic md:text-5xl">{title}</h1>
      <div className="divider-gold my-6 max-w-28" />
      <div className="space-y-4 text-sm leading-relaxed text-[var(--muted)]">
        {children}
      </div>
    </div>
  );
}

export function InfoPage({
  title,
  paragraphs,
}: {
  title: string;
  paragraphs: string[];
}) {
  return (
    <PageShell title={title}>
      {paragraphs.map((p) => (
        <p key={p.slice(0, 24)}>{p}</p>
      ))}
    </PageShell>
  );
}

export { PageShell };
