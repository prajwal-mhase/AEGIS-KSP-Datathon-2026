import { clsx } from 'clsx';

export const Panel = ({ title, action, children, className }: { title?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) => (
  <section className={clsx('border border-line bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03]', className)}>
    {(title || action) && (
      <div className="flex items-center justify-between border-b border-line px-4 py-3 dark:border-white/10">
        {title && <h2 className="text-sm font-semibold">{title}</h2>}
        {action}
      </div>
    )}
    {children}
  </section>
);
