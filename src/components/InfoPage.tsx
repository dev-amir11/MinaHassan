import Link from "next/link";

function PageShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <nav className="mb-6 flex text-sm font-medium text-slate-500">
        <Link href="/" className="hover:text-slate-900">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">{title}</span>
      </nav>
      <h1 className="font-heading text-3xl font-bold text-slate-900 md:text-4xl">{title}</h1>
      <div className="my-6 h-px bg-slate-200" />
      <div className="space-y-4 text-sm leading-relaxed text-slate-600">{children}</div>
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
