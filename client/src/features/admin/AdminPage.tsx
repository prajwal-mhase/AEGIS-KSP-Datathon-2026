import { useQuery } from '@tanstack/react-query';
import { Panel } from '../../components/Panel';
import { api } from '../../lib/api';

export const AdminPage = () => {
  const users = useQuery({ queryKey: ['admin-users'], queryFn: () => api<Array<{ id: string; name: string; email: string; role: string; isActive: boolean }>>('/api/admin/users') });
  const logs = useQuery({ queryKey: ['audit-logs'], queryFn: () => api<Array<{ id: string; action: string; entity: string; createdAt: string; user?: { email: string } }>>('/api/admin/audit-logs') });

  return (
    <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
      <Panel title="Users">
        <div className="divide-y divide-line dark:divide-white/10">
          {users.data?.map((user) => (
            <div key={user.id} className="px-4 py-3 text-sm">
              <div className="font-medium">{user.name}</div>
              <div className="text-steel dark:text-slate-400">{user.email}</div>
              <div className="mt-1 font-mono text-xs">{user.role} · {user.isActive ? 'ACTIVE' : 'DISABLED'}</div>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Audit log">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-[0.12em] text-steel dark:border-white/10">
              <tr>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Entity</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.data?.map((log) => (
                <tr key={log.id} className="border-b border-line/70 dark:border-white/10">
                  <td className="px-4 py-3 font-mono text-xs">{log.action}</td>
                  <td className="px-4 py-3">{log.entity}</td>
                  <td className="px-4 py-3">{log.user?.email ?? 'system'}</td>
                  <td className="px-4 py-3">{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
};
