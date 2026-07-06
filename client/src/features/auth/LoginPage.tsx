import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { LoginRequestSchema, type AuthResponse, type LoginRequest } from '@aegis/shared';
import { api, ApiClientError } from '../../lib/api';
import { useAuthStore } from '../../state/auth.store';

export const LoginPage = () => {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: { email: 'admin@aegis.local', password: 'AegisAdmin!2026' },
  });

  const submit = handleSubmit(async (values) => {
    try {
      const session = await api<AuthResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify(values) });
      setSession(session);
      navigate('/');
    } catch (error) {
      setError('root', {
        message: error instanceof ApiClientError ? error.message : 'Unable to sign in.',
      });
    }
  });

  return (
    <main className="grid min-h-screen grid-cols-1 bg-[#eef1f4] lg:grid-cols-[1fr_520px]">
      <section className="hidden border-r border-line bg-ink p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center bg-white text-ink">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="font-bold tracking-[0.2em]">AEGIS</div>
            <div className="text-sm text-slate-300">Smart Unified Threat & Response Analytics</div>
          </div>
        </div>
        <div className="max-w-2xl">
          <div className="mb-5 font-mono text-xs uppercase tracking-[0.24em] text-slate-400">Operational intelligence</div>
          <h1 className="text-5xl font-semibold leading-tight">Verified crime analytics, conversationally accessible.</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
            Query FIR records, inspect district risk signals, and turn verified database evidence into decisions without losing auditability.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm text-slate-300">
          <span>RBAC enforced</span>
          <span>SQL verified</span>
          <span>Audit logged</span>
        </div>
      </section>
      <section className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-sm border border-line bg-white p-7 shadow-panel">
          <div className="mb-7">
            <div className="text-xs uppercase tracking-[0.2em] text-steel">Secure access</div>
            <h2 className="mt-2 text-2xl font-semibold">Sign in to AEGIS</h2>
          </div>
          <label className="mb-4 block">
            <span className="text-sm font-medium">Official email</span>
            <input className="focus-ring mt-2 w-full border border-line px-3 py-2.5" {...register('email')} />
            {errors.email && <span className="mt-1 block text-sm text-alert">{errors.email.message}</span>}
          </label>
          <label className="mb-5 block">
            <span className="text-sm font-medium">Password</span>
            <input type="password" className="focus-ring mt-2 w-full border border-line px-3 py-2.5" {...register('password')} />
            {errors.password && <span className="mt-1 block text-sm text-alert">{errors.password.message}</span>}
          </label>
          {errors.root && <div className="mb-4 border border-alert/30 bg-alert/10 px-3 py-2 text-sm text-alert">{errors.root.message}</div>}
          <button className="focus-ring w-full bg-ink px-4 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={isSubmitting}>
            {isSubmitting ? 'Authenticating...' : 'Enter command center'}
          </button>
          <p className="mt-5 text-xs leading-5 text-steel">Default local seed account is shown for development. Rotate credentials before deployment.</p>
        </form>
      </section>
    </main>
  );
};
