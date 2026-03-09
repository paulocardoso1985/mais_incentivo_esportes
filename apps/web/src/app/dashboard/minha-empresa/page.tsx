'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api-client';

export default function MinhaEmpresaPage() {
    const router = useRouter();
    const [links, setLinks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) { router.push('/login'); return; }

        apiFetch('/links/my-status')
            .then((data: any) => setLinks(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [router]);

    const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: string }> = {
        PENDING: { label: 'Aguardando Aprovação', color: 'text-yellow-700', bgColor: 'bg-yellow-50 border-yellow-200', icon: '⏳' },
        APPROVED: { label: 'Vínculo Aprovado', color: 'text-green-700', bgColor: 'bg-green-50 border-green-200', icon: '✅' },
        REJECTED: { label: 'Vínculo Recusado', color: 'text-red-700', bgColor: 'bg-red-50 border-red-200', icon: '❌' },
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen font-black text-mais-navy uppercase tracking-widest animate-pulse">Carregando...</div>;

    return (
        <div className="min-h-screen bg-mais-navy/5 pb-20">
            <nav className="bg-mais-navy p-4 text-white shadow-lg sticky top-0 z-50">
                <div className="max-w-4xl mx-auto flex justify-between items-center px-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.push('/dashboard')} className="hover:opacity-70 transition-opacity">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7" /></svg>
                        </button>
                        <h1 className="text-sm font-black uppercase tracking-widest">Minha <span className="text-mais-orange">Empresa</span></h1>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto p-4 sm:p-8">
                <header className="mb-10">
                    <h2 className="text-4xl font-black text-mais-navy uppercase tracking-tighter">Vínculos</h2>
                    <p className="text-gray-400 mt-2 font-medium italic">Status do seu vínculo com a empresa empregadora.</p>
                </header>

                {links.length === 0 ? (
                    <div className="bg-white rounded-[2rem] p-12 text-center shadow-xl border-2 border-dashed border-gray-100">
                        <p className="text-gray-400 font-bold uppercase italic text-sm">Você não solicitou vínculo com nenhuma empresa ainda.</p>
                        <p className="text-gray-300 text-xs font-bold uppercase tracking-widest mt-2">Ao se cadastrar, informe o CNPJ da sua empresa para solicitar um vínculo.</p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {links.map((link) => {
                            const cfg = statusConfig[link.status] || statusConfig.PENDING;
                            return (
                                <div key={link.id} className={`bg-white rounded-[2rem] p-8 shadow-xl border-2 flex flex-col gap-4 ${link.status === 'APPROVED' ? 'border-mais-orange/30' : 'border-gray-100'}`}>
                                    <div className="flex items-center justify-between gap-6">
                                        <div className="flex items-center gap-6">
                                            <span className="text-3xl">{cfg.icon}</span>
                                            <div>
                                                <p className="font-black text-mais-navy uppercase text-lg tracking-tight">{link.store?.name}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{link.store?.document}</p>
                                                <span className={`inline-block mt-2 text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${cfg.bgColor} ${cfg.color}`}>
                                                    {cfg.label}
                                                </span>
                                            </div>
                                        </div>
                                        {link.status === 'APPROVED' && link.coinPercentage > 0 && (
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sua % de Mais Coins</p>
                                                <p className="text-4xl font-black text-mais-orange tracking-tighter">{link.coinPercentage}<span className="text-lg text-gray-400">%</span></p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Alerta de NFs em standby */}
                                    {link.standbyInvoiceCount > 0 && (
                                        <div className={`rounded-2xl p-4 flex items-start gap-3 ${link.status === 'PENDING' ? 'bg-yellow-50 border border-yellow-200' : 'bg-orange-50 border border-orange-200'}`}>
                                            <span className="text-xl">⏸️</span>
                                            <div>
                                                <p className={`text-xs font-black uppercase tracking-widest ${link.status === 'PENDING' ? 'text-yellow-700' : 'text-orange-700'}`}>
                                                    {link.standbyInvoiceCount} Nota{link.standbyInvoiceCount > 1 ? 's Fiscais' : ' Fiscal'} em espera
                                                </p>
                                                <p className={`text-[11px] mt-1 font-medium ${link.status === 'PENDING' ? 'text-yellow-600' : 'text-orange-600'}`}>
                                                    {link.status === 'PENDING'
                                                        ? 'Aguardando aprovação da empresa. Os coins serão contabilizados automaticamente após a aprovação e definição da porcentagem.'
                                                        : 'A empresa ainda não definiu sua porcentagem de coins. Os coins serão contabilizados assim que a porcentagem for configurada.'}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
