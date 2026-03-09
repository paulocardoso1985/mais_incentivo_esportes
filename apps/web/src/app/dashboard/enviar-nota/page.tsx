'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

export default function EnviarNotaPage() {
    const router = useRouter();
    const [accessKey, setAccessKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            await apiFetch('/invoices/submit', {
                method: 'POST',
                body: JSON.stringify({ accessKey }),
            });
            setSuccess(true);
            setAccessKey('');
            // Refresh local user data to update balance
            const userData: any = await apiFetch('/profile');
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-mais-navy p-4 text-white">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
                    <div className="flex items-center">
                        <button onClick={() => router.back()} className="mr-4 hover:opacity-80">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <h1 className="text-xl font-bold">Enviar Nota Fiscal</h1>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all"
                    >
                        Voltar ao Início
                    </button>
                </div>
            </nav>

            <main className="max-w-2xl mx-auto p-4 mt-12 text-center">
                <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
                    <div className="w-20 h-20 bg-mais-orange/10 rounded-full flex items-center justify-center mx-auto mb-6 text-mais-orange">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>

                    <h2 className="text-2xl font-black text-mais-navy uppercase tracking-tight">Ganhe Mais Coins</h2>
                    <p className="text-gray-500 mt-2">Insira os 44 dígitos da chave de acesso da sua Nota Fiscal de compra de produtos Mais Corporativo.</p>

                    <form className="mt-10" onSubmit={handleSubmit}>
                        <div className="relative">
                            <input
                                type="text"
                                required
                                maxLength={44}
                                value={accessKey}
                                onChange={(e) => setAccessKey(e.target.value.replace(/\D/g, ''))}
                                placeholder="0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000"
                                className="w-full text-center text-lg font-mono tracking-widest py-4 border-2 border-gray-100 rounded-xl focus:border-mais-orange focus:outline-none transition-all placeholder:tracking-normal placeholder:font-sans"
                            />
                            <p className="text-[10px] text-gray-400 mt-2 uppercase font-bold tracking-widest">Dígitos informados: {accessKey.length}/44</p>
                        </div>

                        {error && (
                            error.includes('Mais Corporativo') ? (
                                <div className="mt-4 p-5 bg-amber-50 border border-amber-200 rounded-2xl text-left flex items-start gap-4">
                                    <span className="text-2xl flex-shrink-0">🚫</span>
                                    <div>
                                        <p className="text-amber-800 font-black uppercase text-xs tracking-widest mb-1">Nota Fiscal Não Contabilizada</p>
                                        <p className="text-amber-700 text-sm leading-relaxed">{error}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 flex items-center gap-3">
                                    <span className="flex-shrink-0">⚠️</span>
                                    <span>{error}</span>
                                </div>
                            )
                        )}
                        {success && <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-xl text-sm border border-green-100 flex items-center gap-2">🎉 <span>Nota enviada com sucesso! Seus <b>Mais Coins</b> foram creditados.</span></div>}

                        <button
                            disabled={loading || accessKey.length !== 44}
                            className="mt-8 w-full bg-mais-navy text-white py-4 rounded-xl font-black text-lg shadow-lg hover:shadow-mais-navy/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:bg-gray-300 disabled:scale-100 disabled:shadow-none uppercase tracking-wide"
                        >
                            {loading ? 'Processando...' : 'Validar e Ganhar Coins'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
