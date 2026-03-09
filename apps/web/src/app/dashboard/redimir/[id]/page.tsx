'use client';

import { useEffect, useState, use } from 'react';
import { apiFetch } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

export default function RedimirPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { id } = params;
    const [pkg, setPkg] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [paxName, setPaxName] = useState('');
    const [paxDoc, setPaxDoc] = useState('');
    const [paxBirth, setPaxBirth] = useState('');
    const [paxEmail, setPaxEmail] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));

        async function loadData() {
            try {
                const data: any = await apiFetch(`/events/${id}`);
                setPkg(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [id]);

    async function handleCheckout(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            await apiFetch('/orders', {
                method: 'POST',
                body: JSON.stringify({
                    packageId: id,
                    passengers: [
                        {
                            fullName: paxName,
                            document: paxDoc,
                            birthDate: paxBirth,
                            email: paxEmail
                        }
                    ]
                })
            });

            // Update local storage balance
            const freshProfile: any = await apiFetch('/profile');
            localStorage.setItem('user', JSON.stringify(freshProfile));

            router.push('/dashboard/extrato');
        } catch (err: any) {
            setError(err.message);
            setSubmitting(false);
        }
    }

    if (loading) return <div className="p-20 text-center uppercase font-black text-mais-navy animate-pulse">Iniciando protocolo de resgate...</div>;
    if (!pkg) return <div className="p-20 text-center">Pacote não encontrado.</div>;

    return (
        <div className="min-h-screen bg-mais-navy/5">
            <nav className="bg-mais-navy p-4 text-white">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
                    <div className="flex items-center">
                        <button onClick={() => router.back()} className="mr-4 hover:opacity-80">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <h1 className="text-xl font-bold uppercase tracking-widest italic">Confirmação de Resgate</h1>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all"
                    >
                        Voltar ao Início
                    </button>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                {/* Lado Esquerdo: Resumo do Pacote */}
                <div className="lg:col-span-2 space-y-6">
                    <section className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 overflow-hidden relative">
                        {pkg.imageUrl && (
                            <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
                                <img src={pkg.imageUrl} alt="" className="w-full h-full object-cover grayscale" />
                            </div>
                        )}
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                        </div>

                        <span className="bg-mais-navy text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                            {pkg.championship}
                        </span>
                        <h2 className="text-4xl font-black text-mais-navy mt-4 uppercase leading-none">{pkg.teamMatch}</h2>
                        <div className="flex items-center text-gray-500 font-bold mt-4 uppercase text-sm">
                            <svg className="w-5 h-5 mr-1 text-mais-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {pkg.location} • {new Date(pkg.eventDate).toLocaleDateString('pt-BR')}
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-50 grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className={`p-4 rounded-2xl text-center border ${pkg.hasAirfare ? 'bg-green-50 border-green-100 text-green-700' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                                <p className="text-[10px] font-black uppercase">Voo</p>
                                <p className="font-bold text-xs">{pkg.hasAirfare ? 'Incluído' : '-'}</p>
                            </div>
                            <div className={`p-4 rounded-2xl text-center border ${pkg.hasHotel ? 'bg-green-50 border-green-100 text-green-700' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                                <p className="text-[10px] font-black uppercase">Hotel</p>
                                <p className="font-bold text-xs">{pkg.hasHotel ? 'Incluído' : '-'}</p>
                            </div>
                            <div className={`p-4 rounded-2xl text-center border ${pkg.hasTransfer ? 'bg-green-50 border-green-100 text-green-700' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                                <p className="text-[10px] font-black uppercase">Traslado</p>
                                <p className="font-bold text-xs">{pkg.hasTransfer ? 'Incluído' : '-'}</p>
                            </div>
                            <div className={`p-4 rounded-2xl text-center border ${pkg.hasFood ? 'bg-green-50 border-green-100 text-green-700' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                                <p className="text-[10px] font-black uppercase">Food</p>
                                <p className="font-bold text-xs">{pkg.hasFood ? 'Incluído' : '-'}</p>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100">
                        <h3 className="text-xl font-black text-mais-navy uppercase mb-6">Informações do Passageiro</h3>
                        <form id="checkout-form" onSubmit={handleCheckout} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Nome Completo (Conforme Documento)</label>
                                <input type="text" required value={paxName} onChange={(e) => setPaxName(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-mais-orange font-bold text-mais-navy" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">CPF / RG</label>
                                <input type="text" required value={paxDoc} onChange={(e) => setPaxDoc(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-mais-orange font-bold text-mais-navy" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Data de Nascimento</label>
                                <input type="date" required value={paxBirth} onChange={(e) => setPaxBirth(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-mais-orange font-bold text-mais-navy" />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">E-mail para confirmação</label>
                                <input type="email" required value={paxEmail} onChange={(e) => setPaxEmail(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-mais-orange font-bold text-mais-navy" />
                            </div>
                        </form>
                    </section>
                </div>

                {/* Lado Direito: Resumo Financeiro */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-[2rem] p-8 shadow-2xl border-2 border-mais-orange/20 sticky top-24">
                        <h3 className="text-lg font-black text-mais-navy uppercase mb-6 text-center">Resumo da Reserva</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400 font-bold uppercase">Pacote Premium</span>
                                <span className="font-black text-mais-navy">{pkg.priceCoins} Mais Coins</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400 font-bold uppercase">Taxas de Emissão</span>
                                <span className="font-black text-mais-navy">GRÁTIS</span>
                            </div>
                            <div className="pt-4 mt-4 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-mais-navy font-black uppercase">Total do Resgate</span>
                                <span className="text-3xl font-black text-mais-orange">{pkg.priceCoins} <span className="text-xs">Mais Coins</span></span>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-mais-navy/5 rounded-2xl">
                            <p className="text-[10px] text-gray-400 font-black uppercase text-center mb-1">Seu Saldo Atual</p>
                            <p className={`text-center font-black text-xl ${user?.coinBalance < pkg.priceCoins ? 'text-red-500' : 'text-mais-navy'}`}>
                                {user?.coinBalance} Mais Coins
                            </p>
                            {user?.coinBalance < pkg.priceCoins && (
                                <p className="text-[10px] text-red-500 font-bold text-center mt-2 uppercase">Saldo insuficiente para este resgate</p>
                            )}
                        </div>

                        {error && <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-xs font-bold border border-red-100">{error}</div>}

                        <button
                            form="checkout-form"
                            disabled={submitting || user?.coinBalance < pkg.priceCoins}
                            className="mt-8 w-full bg-mais-orange text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:bg-gray-200 disabled:scale-100 disabled:shadow-none"
                        >
                            {submitting ? 'Processando Reserva...' : 'Confirmar Resgate'}
                        </button>
                        <p className="text-[10px] text-gray-400 text-center mt-4 font-bold uppercase px-4 italic">
                            Ao confirmar, os coins serão debitados imediatamente e sua reserva será processada.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
