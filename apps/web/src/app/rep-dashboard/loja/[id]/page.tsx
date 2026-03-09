'use client';

import { useEffect, useState, use } from 'react';
import { apiFetch } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

export default function StoreDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [store, setStore] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const result: any = await apiFetch(`/representative/store/${id}`);
                setStore(result);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [id]);

    if (loading) return <div className="p-20 text-center font-black animate-pulse">Carregando detalhes da loja...</div>;
    if (!store) return <div className="p-20 text-center">Loja não encontrada ou acesso negado.</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <nav className="bg-mais-navy p-4 text-white">
                <div className="max-w-7xl mx-auto flex items-center px-4">
                    <button onClick={() => router.back()} className="mr-4 hover:opacity-80">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h1 className="text-xl font-bold uppercase tracking-widest">{store.name}</h1>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-4 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Info Principal */}
                    <div className="lg:col-span-1 space-y-6">
                        <section className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Dados Cadastrais</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Razão Social</p>
                                    <p className="font-black text-mais-navy uppercase">{store.name}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">CNPJ</p>
                                    <p className="font-black text-mais-navy">{store.document}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">E-mail</p>
                                    <p className="font-bold text-gray-600">{store.email}</p>
                                </div>
                                <div className="pt-4 border-t border-gray-50">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Saldo Atual da Loja</p>
                                    <p className="text-3xl font-black text-mais-orange">{store.coinBalance} <span className="text-xs">Mais Coins</span></p>
                                </div>
                            </div>
                        </section>

                        <section className="bg-mais-navy p-8 rounded-[2rem] shadow-xl text-white">
                            <h3 className="text-xs font-black text-mais-orange uppercase tracking-widest mb-4">Ações Rápidas</h3>
                            <div className="space-y-3">
                                <button className="w-full bg-white/10 p-3 rounded-xl text-xs font-bold uppercase hover:bg-white/20 transition-all text-left">Enviar Crédito Especial</button>
                                <button className="w-full bg-white/10 p-3 rounded-xl text-xs font-bold uppercase hover:bg-white/20 transition-all text-left">Suspender Acesso</button>
                                <button className="w-full bg-white/10 p-3 rounded-xl text-xs font-bold uppercase hover:bg-white/20 transition-all text-left">Ver Relatório de Vendas</button>
                            </div>
                        </section>
                    </div>

                    {/* Listas (Vendedores e Notas) */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                                <h3 className="text-lg font-black text-mais-navy uppercase">Vendedores ({store.sellers.length})</h3>
                                <button className="text-mais-orange font-bold text-xs uppercase hover:underline">Ver Todos</button>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {store.sellers.map((seller: any) => (
                                    <div key={seller.id} className="p-4 px-6 flex justify-between items-center transition-colors">
                                        <div>
                                            <p className="font-black text-mais-navy text-sm uppercase">{seller.name}</p>
                                            <p className="text-[10px] text-gray-400 font-bold">{seller.document}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-mais-navy text-sm">{seller.coinBalance} <span className="text-[10px] text-mais-orange">Mais Coins</span></p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                                <h3 className="text-lg font-black text-mais-navy uppercase">Últimas Notas Enviadas</h3>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {store.invoices.map((inv: any) => (
                                    <div key={inv.id} className="p-4 px-6 flex justify-between items-center">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-mais-orange/10 rounded-lg flex items-center justify-center mr-4 text-mais-orange">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-700 text-xs truncate max-w-[200px]">{inv.accessKey}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(inv.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="font-black text-mais-orange">+{inv.coinsIssued} Mais Coins</span>
                                        </div>
                                    </div>
                                ))}
                                {store.invoices.length === 0 && (
                                    <div className="p-10 text-center text-gray-400 font-bold text-xs uppercase italic">Nenhuma nota enviada nos últimos 30 dias.</div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
