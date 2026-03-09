'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

export default function ExtratoPage() {
    const router = useRouter();
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadHistory() {
            try {
                const data: any = await apiFetch('/ledger/extrato');
                setHistory(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadHistory();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <nav className="bg-mais-navy p-4 text-white">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
                    <div className="flex items-center">
                        <button onClick={() => router.back()} className="mr-4 hover:opacity-80">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <h1 className="text-xl font-bold">Extrato de Mais Coins</h1>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all"
                    >
                        Voltar ao Início
                    </button>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto p-4 mt-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-mais-navy/5">
                        <h2 className="text-lg font-bold text-mais-navy">Histórico de Transações</h2>
                        <p className="text-sm text-gray-500">Acompanhe todos os seus créditos e débitos de Mais Coins.</p>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-gray-500">Carregando transações...</div>
                    ) : history.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">Nenhuma transação encontrada.</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {history.map((item) => (
                                <div key={item.id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                    <div>
                                        <p className="font-bold text-gray-800">{item.description}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(item.createdAt).toLocaleDateString('pt-BR')} às {new Date(item.createdAt).toLocaleTimeString('pt-BR')}
                                        </p>
                                        <span className="inline-block mt-2 text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-bold uppercase">
                                            {item.type}
                                        </span>
                                    </div>
                                    <div className={`text-xl font-black ${item.amount > 0 ? 'text-mais-orange' : 'text-red-500'}`}>
                                        {item.amount > 0 ? '+' : ''}{item.amount} Mais Coins
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
