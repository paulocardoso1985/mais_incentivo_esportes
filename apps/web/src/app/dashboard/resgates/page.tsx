'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

export default function MeusResgatesPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            router.push('/login');
            return;
        }

        async function loadOrders() {
            try {
                const data: any = await apiFetch('/orders');
                setOrders(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadOrders();
    }, [router]);

    if (loading || !user) return <div className="p-20 text-center animate-pulse font-black text-mais-navy uppercase tracking-widest">Carregando seus resgates...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-mais-navy p-4 text-white shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
                    <div className="flex items-center">
                        <button onClick={() => router.back()} className="mr-4 hover:opacity-80 transition-all">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <h1 className="text-xl font-bold uppercase tracking-tight">Meus <span className="text-mais-orange font-black">Resgates</span></h1>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="text-xs font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all"
                    >
                        Voltar ao Início
                    </button>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto p-4 sm:p-8">
                <header className="mb-10 text-center sm:text-left">
                    <h2 className="text-4xl font-black text-mais-navy uppercase tracking-tighter">Acompanhamento</h2>
                    <p className="text-gray-500 mt-2 font-medium">Veja o status das suas experiências resgatadas.</p>
                </header>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-[2rem] p-20 text-center shadow-xl border border-gray-100">
                        <div className="bg-mais-navy/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-mais-navy/20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                        </div>
                        <p className="text-gray-400 text-lg font-bold">Você ainda não realizou nenhum resgate.</p>
                        <button
                            className="mt-6 bg-mais-navy text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-lg"
                            onClick={() => router.push('/dashboard/catalogo')}
                        >
                            Ver Catálogo
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center sm:items-stretch gap-6 group hover:shadow-2xl transition-all">
                                {/* Imagem do Pacote */}
                                <div className="w-full sm:w-48 h-32 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0 relative">
                                    {order.package.imageUrl ? (
                                        <img src={order.package.imageUrl} alt={order.package.teamMatch} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full bg-mais-navy flex items-center justify-center text-white/10 text-xs">
                                            SEM IMAGEM
                                        </div>
                                    )}
                                    <div className="absolute top-2 left-2">
                                        <span className="bg-mais-orange text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm">
                                            {order.package.championship}
                                        </span>
                                    </div>
                                </div>

                                {/* Detalhes */}
                                <div className="flex-grow flex flex-col justify-center text-center sm:text-left">
                                    <h3 className="text-xl font-black text-mais-navy uppercase leading-tight">{order.package.teamMatch}</h3>
                                    <p className="text-gray-400 text-xs font-bold uppercase mt-1 tracking-wider">{order.package.location} • {new Date(order.package.eventDate).toLocaleDateString('pt-BR')}</p>

                                    <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                                        {order.package.hasAirfare && <span className="text-[10px] text-gray-400 font-bold uppercase italic">Voo</span>}
                                        {order.package.hasHotel && <span className="text-[10px] text-gray-400 font-bold uppercase italic">Hotel</span>}
                                        {order.package.hasFood && <span className="text-[10px] text-gray-400 font-bold uppercase italic">Alimentação</span>}
                                    </div>
                                </div>

                                {/* Status e Valor */}
                                <div className="flex flex-col items-center sm:items-end justify-center sm:border-l border-gray-50 sm:pl-8 flex-shrink-0">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm mb-3
                                        ${order.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                            order.status === 'FULFILLED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {order.status === 'PENDING' ? 'Processando' :
                                            order.status === 'FULFILLED' ? 'Atendido' : order.status}
                                    </span>
                                    <p className="text-2xl font-black text-mais-navy leading-none">{order.totalCoins} <span className="text-xs text-mais-orange font-bold">Mais Coins</span></p>
                                    <p className="text-[10px] text-gray-300 font-bold uppercase mt-2">Resgatado em {new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
