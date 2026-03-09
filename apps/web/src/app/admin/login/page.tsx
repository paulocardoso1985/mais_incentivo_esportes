'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api-client';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data: any = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ document: email, passwordHash: password }),
            });

            if (data.user.role !== 'ADMIN') {
                throw new Error('Acesso restrito a administradores.');
            }

            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
            router.push('/admin/pacotes');
        } catch (err: any) {
            setError(err.message || 'Erro ao realizar login.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="w-full max-w-md space-y-8 rounded-[2rem] bg-white p-10 shadow-2xl border-t-8 border-mais-orange">
                <div className="text-center">
                    <h1 className="text-3xl font-black text-mais-navy uppercase italic tracking-tighter">
                        CMS <span className="text-mais-orange">Gestão</span>
                    </h1>
                    <p className="mt-4 text-xs font-black text-gray-400 uppercase tracking-widest">Acesso Restrito Mais Corporativo</p>
                </div>

                <form className="mt-10 space-y-6" onSubmit={handleLogin}>
                    {error && (
                        <div className="rounded-xl bg-red-50 p-4 text-xs font-bold text-red-600 border border-red-100 uppercase tracking-tight text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">E-mail Administrativo</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-2xl border-2 border-gray-50 bg-gray-50 px-4 py-4 text-mais-navy focus:border-mais-orange focus:bg-white focus:outline-none transition-all font-medium"
                                placeholder="usuario@maiscorporativo.com.br"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Senha</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-2xl border-2 border-gray-50 bg-gray-50 px-4 py-4 text-mais-navy focus:border-mais-orange focus:bg-white focus:outline-none transition-all font-medium"
                                placeholder="••••••••"
                            />
                            <div className="mt-1 text-right px-2">
                                <a href="/forgot-password" title="Recuperar acesso" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-mais-navy transition-colors">
                                    Esqueci minha senha
                                </a>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center rounded-2xl bg-mais-navy py-5 text-sm font-black text-white shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 uppercase tracking-widest"
                    >
                        {loading ? 'Validando...' : 'Entrar no Painel'}
                    </button>

                    <div className="text-center">
                        <a href="/login" className="text-[10px] font-black text-gray-400 hover:text-mais-navy transition-colors uppercase tracking-widest">
                            Voltar para área de Clientes
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
