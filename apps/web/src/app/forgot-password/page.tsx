'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const res: any = await apiFetch('/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify({ email }),
            });
            setMessage(res.message || 'Se o e-mail estiver cadastrado, as instruções foram enviadas.');
        } catch (err: any) {
            setError(err.message || 'Erro ao processar solicitação.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-mais-navy flex items-center justify-center p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 relative overflow-hidden">
                {/* Faixa Decorativa */}
                <div className="absolute top-0 left-0 w-full h-2 bg-mais-orange" />

                <header className="text-center mb-8">
                    <h1 className="text-3xl font-black text-mais-navy uppercase italic tracking-tighter">
                        RECUPERAR <span className="text-mais-orange whitespace-nowrap">SENHA</span>
                    </h1>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-2">
                        Insira seu e-mail para receber o link de acesso
                    </p>
                </header>

                {message ? (
                    <div className="text-center py-10">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <p className="text-mais-navy font-bold mb-8">{message}</p>
                        <Link href="/login" className="text-xs font-black text-mais-navy uppercase tracking-widest border-b-2 border-mais-orange hover:pb-1 transition-all">
                            Voltar para o Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-[10px] font-black uppercase border border-red-100 text-center">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">E-mail Cadastrado</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-mais-navy font-bold focus:border-mais-navy focus:bg-white transition-all outline-none"
                                placeholder="exemplo@email.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-mais-navy text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-mais-navy/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {loading ? 'Processando...' : 'Enviar Link de Recuperação'}
                        </button>

                        <div className="text-center pt-4">
                            <Link href="/login" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-mais-navy transition-colors">
                                Cancelar e Voltar
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
