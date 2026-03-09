'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

export default function AdminPacotesPage() {
    const router = useRouter();
    const [packages, setPackages] = useState<any[]>([]);
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

        async function loadPackages() {
            try {
                const data: any = await apiFetch('/events');
                setPackages(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadPackages();
    }, [router]);

    async function handleDelete(id: string) {
        if (!confirm('Deseja realmente remover este pacote?')) return;
        try {
            await apiFetch(`/events/cms/${id}`, { method: 'DELETE' });
            setPackages(packages.filter(p => p.id !== id));
        } catch (err: any) {
            alert('Erro ao remover: ' + err.message);
        }
    }

    if (loading || !user) return <div className="p-20 text-center animate-pulse font-black text-mais-navy uppercase">Carregando painel de controle...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-mais-navy p-4 text-white shadow-xl">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
                    <div className="flex items-center">
                        <button onClick={() => router.push('/dashboard')} className="mr-4 hover:opacity-80">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7" /></svg>
                        </button>
                        <h1 className="text-xl font-bold uppercase tracking-tighter">CMS <span className="text-mais-orange font-black">Pacotes</span></h1>
                    </div>
                    <div className="flex items-center space-x-8">
                        <button onClick={() => router.push('/admin/pacotes')} className="text-xs font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-all">Pacotes</button>
                        <button onClick={() => router.push('/admin/pedidos')} className="text-xs font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-all">Pedidos</button>
                        <button onClick={() => router.push('/admin/usuarios')} className="text-xs font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-all">Usuários</button>
                        <button onClick={() => router.push('/admin/emissores')} className="text-xs font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-all">Emissores</button>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => {
                                localStorage.clear();
                                router.push('/admin/login');
                            }}
                            className="text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-full transition-all"
                        >
                            Sair
                        </button>
                        <button
                            onClick={() => router.push('/admin/pacotes/novo')}
                            className="bg-mais-orange text-mais-navy px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-mais-orange/20"
                        >
                            + Novo Pacote
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-4 sm:p-8">
                <header className="mb-10">
                    <h2 className="text-3xl font-black text-mais-navy uppercase tracking-tight">Gerenciar Catálogo</h2>
                    <p className="text-gray-500">Adicione, edite ou remova pacotes de viagens e jogos.</p>
                </header>

                <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <tr>
                                <th className="px-8 py-4">Evento / Campeonato</th>
                                <th className="px-8 py-4">Data</th>
                                <th className="px-8 py-4">Preço (Coins)</th>
                                <th className="px-8 py-4">Estoque</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {packages.map((pkg) => (
                                <tr key={pkg.id} className="hover:bg-mais-navy/[0.01]">
                                    <td className="px-8 py-6">
                                        <p className="font-black text-mais-navy uppercase text-sm">{pkg.teamMatch}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">{pkg.championship}</p>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-gray-600 font-medium">
                                        {new Date(pkg.eventDate).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="font-black text-mais-navy">{pkg.priceCoins}</span>
                                    </td>
                                    <td className="px-8 py-6 text-sm">
                                        <span className={`${pkg.stock < 5 ? 'text-red-500 font-bold' : 'text-gray-600'}`}>
                                            {pkg.stock} unidades
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black bg-green-100 text-green-800 uppercase tracking-widest">Ativo</span>
                                    </td>
                                    <td className="px-8 py-6 text-right flex justify-end space-x-2">
                                        <button
                                            onClick={() => router.push(`/admin/pacotes/${pkg.id}/editar`)}
                                            className="text-gray-300 hover:text-mais-navy transition-colors p-2"
                                            title="Editar"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(pkg.id)}
                                            className="text-gray-200 hover:text-red-500 transition-colors p-2"
                                            title="Remover"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {packages.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center text-gray-400 italic uppercase font-bold">Nenhum pacote cadastrado.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
