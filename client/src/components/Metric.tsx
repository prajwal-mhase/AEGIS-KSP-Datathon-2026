export const Metric = ({ label, value, detail }: { label: string; value: string | number; detail: string }) => (
  <div className="border border-line bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
    <div className="text-xs uppercase tracking-[0.14em] text-steel dark:text-slate-400">{label}</div>
    <div className="mt-2 text-2xl font-semibold">{value}</div>
    <div className="mt-1 text-xs text-steel dark:text-slate-400">{detail}</div>
  </div>
);
