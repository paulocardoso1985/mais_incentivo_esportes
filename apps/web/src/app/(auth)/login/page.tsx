'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api-client';

export default function LoginPage() {
    const router = useRouter();
    const [document, setDocument] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data: any = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ document, passwordHash: password }),
            });

            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));

            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-mais-navy px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-2xl">
                <div>
                    <h1 className="text-center text-3xl font-bold text-mais-navy">
                        Mais Corporativo <span className="text-mais-orange">Esportes</span>
                    </h1>
                    <h2 className="mt-6 text-center text-xl font-semibold tracking-tight text-gray-900">
                        Acesse seu painel
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Use seu CNPJ ou CPF para entrar
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="document" className="block text-sm font-medium text-gray-700">
                                Documento (CNPJ ou CPF)
                            </label>
                            <input
                                id="document"
                                name="document"
                                type="text"
                                required
                                value={document}
                                onChange={(e) => setDocument(e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-mais-orange focus:outline-none focus:ring-mais-orange sm:text-sm"
                                placeholder="000.000.000-00"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Senha
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-gray-100 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-mais-orange focus:outline-none focus:ring-mais-orange sm:text-sm"
                                placeholder="••••••••"
                            />
                            <div className="mt-1 text-right">
                                <a href="/forgot-password" title="Recuperar acesso" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-mais-navy transition-colors">
                                    Esqueci minha senha
                                </a>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center rounded-lg bg-mais-orange px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-mais-orange focus:ring-offset-2 disabled:bg-gray-400"
                    >
                        {loading ? 'Entrando...' : 'Entrar na plataforma'}
                    </button>

                    <div className="text-center text-sm">
                        <a href="/register" className="font-medium text-mais-navy hover:text-mais-orange">
                            Não tem uma conta? Solicite seu cadastro
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
