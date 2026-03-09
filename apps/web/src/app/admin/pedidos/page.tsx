'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

export default function AdminOrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.role !== 'ADMIN') {
                router.push('/dashboard');
                return;
            }
            setUser(parsedUser);
        } else {
            router.push('/login');
            return;
        }

        async function loadOrders() {
            try {
                const data: any = await apiFetch('/orders/cms/all');
                setOrders(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadOrders();
    }, [router]);

    async function handleStatusChange(id: string, newStatus: string) {
        try {
            await apiFetch(`/orders/cms/${id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status: newStatus })
            });
            setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
        } catch (err: any) {
            alert('Erro ao atualizar status: ' + err.message);
        }
    }

    if (loading || !user) return <div className="p-20 text-center animate-pulse font-black text-mais-navy uppercase">Carregando gestão de pedidos...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-mais-navy p-4 text-white shadow-xl">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
                    <div className="flex items-center">
                        <button onClick={() => router.push('/dashboard')} className="mr-4 hover:opacity-80">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7" /></svg>
                        </button>
                        <h1 className="text-xl font-bold uppercase tracking-tighter">CMS <span className="text-mais-orange font-black">Pedidos</span></h1>
                    </div>
                    <div className="flex items-center space-x-8">
                        <button onClick={() => router.push('/admin/pacotes')} className="text-xs font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-all">Pacotes</button>
                        <button onClick={() => router.push('/admin/pedidos')} className="text-xs font-black uppercase tracking-widest text-mais-orange border-b-2 border-mais-orange">Pedidos</button>
                        <button onClick={() => router.push('/admin/usuarios')} className="text-xs font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-all">Usuários</button>
                        <button onClick={() => router.push('/admin/emissores')} className="text-xs font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-all">Emissores</button>
                    </div>
                    <button
                        onClick={() => {
                            localStorage.clear();
                            router.push('/admin/login');
                        }}
                        className="text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-full transition-all"
                    >
                        Sair
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-4 sm:p-8">
                <header className="mb-10">
                    <h2 className="text-3xl font-black text-mais-navy uppercase tracking-tight">Gestão de Resgates</h2>
                    <p className="text-gray-500">Acompanhe e atenda as solicitações de prêmios dos usuários.</p>
                </header>

                <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <tr>
                                <th className="px-8 py-4">Usuário</th>
                                <th className="px-8 py-4">Pacote</th>
                                <th className="px-8 py-4">Coins</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4">Data</th>
                                <th className="px-8 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-mais-navy/[0.01]">
                                    <td className="px-8 py-6">
                                        <p className="font-black text-mais-navy uppercase text-sm">{order.user.name}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">{order.user.document}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="font-bold text-gray-700 text-sm">{order.package.teamMatch}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">{order.package.championship}</p>
                                    </td>
                                    <td className="px-8 py-6 font-black text-mais-navy">
                                        {order.totalCoins} Mais Coins
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest
                                            ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                order.status === 'FULFILLED' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'}`}>
                                            {order.status === 'PENDING' ? 'Pendente' :
                                                order.status === 'FULFILLED' ? 'Atendido' : order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-gray-400">
                                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-8 py-6 text-right flex justify-end space-x-2">
                                        {order.status === 'PENDING' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusChange(order.id, 'FULFILLED')}
                                                    className="bg-mais-orange text-mais-navy px-4 py-2 rounded-lg text-xs font-black uppercase hover:scale-105 transition-all"
                                                >
                                                    Atender
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(order.id, 'CANCELLED')}
                                                    className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-xs font-black uppercase hover:bg-red-100 transition-all"
                                                >
                                                    Cancelar
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center text-gray-400 italic uppercase font-bold">Nenhum pedido realizado ainda.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
