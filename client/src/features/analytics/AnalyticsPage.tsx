import { useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Panel } from '../../components/Panel';
import { CrimeMap } from '../maps/CrimeMap';
import { useDashboardData } from '../dashboard/useDashboardData';

export const AnalyticsPage = () => {
  const [district, setDistrict] = useState('');
  const { trends, geo, categories } = useDashboardData(district || undefined);

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-steel dark:text-slate-400">Analytics workbench</div>
          <h2 className="mt-1 text-2xl font-semibold">District and station analysis</h2>
        </div>
        <input
          className="focus-ring border border-line bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-[#181d23]"
          placeholder="Filter district"
          value={district}
          onChange={(event) => setDistrict(event.target.value)}
        />
      </div>
      <Panel title="Timeline playback">
        <div className="h-80 p-3">
          <ResponsiveContainer>
            <AreaChart data={trends.data ?? []}>
              <defs>
                <linearGradient id="trend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#176b58" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#176b58" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#d9dee5" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#176b58" fill="url(#trend)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>
      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <Panel title="Category comparison">
          <div className="divide-y divide-line dark:divide-white/10">
            {(categories.data ?? []).map((item) => (
              <div key={item.category} className="flex items-center justify-between px-4 py-3 text-sm">
                <span>{item.category}</span>
                <span className="font-mono">{item.count}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Hotspot analysis">
          <CrimeMap points={geo.data ?? []} />
        </Panel>
      </div>
    </div>
  );
};
