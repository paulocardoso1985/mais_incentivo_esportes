'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

export default function RepDashboardPage() {
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const result: any = await apiFetch('/representative/dashboard');
                setData(result);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) return <div className="p-20 text-center font-black animate-pulse">Carregando painel gerencial...</div>;
    if (!data) return <div className="p-20 text-center">Acesso negado ou erro ao carregar dados.</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <nav className="bg-mais-navy p-4 text-white shadow-lg">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
                    <h1 className="text-xl font-bold italic uppercase tracking-widest">Painel <span className="text-mais-orange">Representante</span></h1>
                    <button onClick={() => {
                        const role = JSON.parse(localStorage.getItem('user') || '{}')?.role;
                        localStorage.clear();
                        router.push(role === 'ADMIN' ? '/admin/login' : '/login');
                    }} className="text-sm border border-white/20 px-3 py-1 rounded hover:bg-white/10">Sair</button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-4 sm:p-8">
                <header className="mb-10">
                    <h2 className="text-3xl font-black text-mais-navy uppercase">Visão Geral da Rede</h2>
                    <p className="text-gray-500">Acompanhe o desempenho das suas lojas e vendedores vinculados.</p>
                </header>

                {/* Métricas Principais */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-3xl shadow-xl border-b-4 border-mais-navy">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total de Lojas</p>
                        <p className="text-3xl font-black text-mais-navy mt-2">{data.metrics.totalStores}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-xl border-b-4 border-mais-orange">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vendedores Ativos</p>
                        <p className="text-3xl font-black text-mais-navy mt-2">{data.metrics.totalSellers}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-xl border-b-4 border-mais-red">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Coins Gerados (Total)</p>
                        <p className="text-3xl font-black text-mais-navy mt-2">{data.metrics.totalCoinsGenerated}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-xl border-b-4 border-mais-orange">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Saldo em Carteira</p>
                        <p className="text-3xl font-black text-mais-navy mt-2">{data.metrics.totalBalanceInNetwork} <span className="text-xs">C</span></p>
                    </div>
                </div>

                {/* Tabela de Lojas */}
                <section className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
                    <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="text-xl font-black text-mais-navy uppercase">Minhas Lojas</h3>
                        <button className="bg-mais-navy text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-opacity-90">Exportar Relatório</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <tr>
                                    <th className="px-8 py-4">Razão Social / CNPJ</th>
                                    <th className="px-8 py-4">Vendedores</th>
                                    <th className="px-8 py-4">Saldo em Coins</th>
                                    <th className="px-8 py-4">Status</th>
                                    <th className="px-8 py-4">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {data.stores.map((store: any) => (
                                    <tr key={store.id} className="hover:bg-mais-navy/[0.02] transition-colors">
                                        <td className="px-8 py-6">
                                            <p className="font-black text-mais-navy uppercase text-sm">{store.name}</p>
                                            <p className="text-[10px] text-gray-400 font-bold">{store.document}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="bg-mais-navy/10 text-mais-navy px-2 py-1 rounded-lg text-xs font-black">{store.sellersCount}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="font-black text-mais-orange text-lg">{store.balance} <span className="text-[10px]">Mais Coins</span></p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black bg-green-100 text-green-800 uppercase tracking-widest">Ativo</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <button onClick={() => router.push(`/rep-dashboard/loja/${store.id}`)} className="text-mais-navy hover:text-mais-orange transition-colors">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {data.stores.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center text-gray-400 font-bold uppercase italic">Nenhuma loja vinculada à sua rede.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}
