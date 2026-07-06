import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Panel } from '../../components/Panel';
import { api } from '../../lib/api';

const FormSchema = z.object({
  name: z.string().min(3),
  cron: z.string().min(5),
  recipients: z.string().min(5),
});

type FormValues = z.infer<typeof FormSchema>;

export const ReportsPage = () => {
  const queryClient = useQueryClient();
  const reports = useQuery({ queryKey: ['reports'], queryFn: () => api<Array<{ id: string; name: string; cron: string; recipients: string[]; isActive: boolean }>>('/api/reports/scheduled') });
  const form = useForm<FormValues>({ resolver: zodResolver(FormSchema), defaultValues: { name: '', cron: '0 8 * * 1', recipients: '' } });
  const createReport = useMutation({
    mutationFn: (values: FormValues) =>
      api('/api/reports/scheduled', {
        method: 'POST',
        body: JSON.stringify({
          name: values.name,
          cron: values.cron,
          recipients: values.recipients.split(',').map((item) => item.trim()),
          filters: {},
        }),
      }),
    onSuccess: () => {
      form.reset({ name: '', cron: '0 8 * * 1', recipients: '' });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });

  return (
    <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
      <Panel title="Schedule report">
        <form className="space-y-4 p-4" onSubmit={form.handleSubmit((values) => createReport.mutate(values))}>
          <label className="block text-sm">
            Report name
            <input className="focus-ring mt-2 w-full border border-line px-3 py-2 dark:border-white/10 dark:bg-transparent" {...form.register('name')} />
          </label>
          <label className="block text-sm">
            Cron expression
            <input className="focus-ring mt-2 w-full border border-line px-3 py-2 font-mono dark:border-white/10 dark:bg-transparent" {...form.register('cron')} />
          </label>
          <label className="block text-sm">
            Recipients
            <input className="focus-ring mt-2 w-full border border-line px-3 py-2 dark:border-white/10 dark:bg-transparent" placeholder="sp@example.gov, analyst@example.gov" {...form.register('recipients')} />
          </label>
          <button className="focus-ring bg-ink px-4 py-2 text-sm font-semibold text-white">Create schedule</button>
        </form>
      </Panel>
      <Panel title="Scheduled reports">
        <div className="divide-y divide-line dark:divide-white/10">
          {reports.data?.map((report) => (
            <div key={report.id} className="grid gap-2 px-4 py-3 text-sm md:grid-cols-[1fr_120px_1fr_80px]">
              <span className="font-medium">{report.name}</span>
              <span className="font-mono">{report.cron}</span>
              <span className="text-steel dark:text-slate-400">{report.recipients.join(', ')}</span>
              <span>{report.isActive ? 'Active' : 'Paused'}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
};
