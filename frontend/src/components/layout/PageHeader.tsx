type Props = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
};

export function PageHeader({ title, subtitle, children }: Props) {
  return (
    <div className="relative mb-10 overflow-hidden rounded-3xl border border-border bg-card/50 px-6 py-10 sm:px-10 sm:py-12">
      <div className="pointer-events-none absolute -top-16 end-0 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 start-0 h-32 w-32 rounded-full bg-accent/5 blur-3xl" />
      <div className="relative">
        <h1 className="section-title">{title}</h1>
        {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
        {children}
      </div>
    </div>
  );
}
