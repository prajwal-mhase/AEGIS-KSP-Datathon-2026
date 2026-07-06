import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Metric } from '../../components/Metric';
import { Panel } from '../../components/Panel';
import { AssistantPanel } from '../assistant/AssistantPanel';
import { CrimeMap } from '../maps/CrimeMap';
import { useDashboardData } from './useDashboardData';

const districts = ['', 'Bengaluru Urban', 'Mysuru', 'Mangaluru', 'Belagavi', 'Kalaburagi'];

export const CommandCenterPage = () => {
  const [district, setDistrict] = useState('');
  const { overview, categories, trends, geo, incidents } = useDashboardData(district || undefined);
  const kpi = overview.data;

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
      <section className="space-y-5">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-steel dark:text-slate-400">Live operational view</div>
            <h2 className="mt-1 text-2xl font-semibold">Statewide crime posture</h2>
          </div>
          <select className="focus-ring border border-line bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-[#181d23]" value={district} onChange={(event) => setDistrict(event.target.value)}>
            {districts.map((item) => (
              <option key={item} value={item}>
                {item || 'All districts'}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Total incidents" value={kpi?.totalIncidents ?? '...'} detail="Filtered FIR records" />
          <Metric label="Investigations" value={kpi?.activeInvestigations ?? '...'} detail="Active case workload" />
          <Metric label="Critical" value={kpi?.criticalIncidents ?? '...'} detail="Priority severity" />
          <Metric label="7 day delta" value={kpi ? `${kpi.sevenDayTrendPct.toFixed(1)}%` : '...'} detail="Compared with previous week" />
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          <Panel title="Incident trend">
            <div className="h-72 p-3">
              <ResponsiveContainer>
                <LineChart data={trends.data ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d9dee5" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#176b58" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
          <Panel title="Category distribution">
            <div className="h-72 p-3">
              <ResponsiveContainer>
                <BarChart data={categories.data ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d9dee5" />
                  <XAxis dataKey="category" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={70} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#242a32" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
        <Panel title="GIS incident map">
          <CrimeMap points={geo.data ?? []} />
        </Panel>
        <Panel title="Recent incidents">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line text-xs uppercase tracking-[0.12em] text-steel dark:border-white/10">
                <tr>
                  <th className="px-4 py-3">FIR</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">District</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {incidents.data?.items.map((item) => (
                  <tr key={item.id} className="border-b border-line/70 dark:border-white/10">
                    <td className="px-4 py-3 font-mono text-xs">{item.firNumber}</td>
                    <td className="px-4 py-3">{item.title}</td>
                    <td className="px-4 py-3">{item.district}</td>
                    <td className="px-4 py-3">{item.severity}</td>
                    <td className="px-4 py-3">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </section>
      <AssistantPanel />
    </div>
  );
};
