'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api-client';

export default function EquipePage() {
    const router = useRouter();
    const [links, setLinks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    // Estado LOCAL do slider: { [linkId]: number }
    // Separado do percentual salvo — só vai ao backend ao confirmar
    const [draftPercentages, setDraftPercentages] = useState<Record<string, number>>({});

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) { router.push('/login'); return; }
        const user = JSON.parse(storedUser);
        if (user.role !== 'CNPJ_MASTER') { router.push('/dashboard'); return; }
        loadLinks();
    }, [router]);

    async function loadLinks() {
        try {
            const data: any = await apiFetch('/links/team');
            setLinks(data);
            // Inicializa o estado de rascunho com os valores atuais do banco
            const initialDrafts: Record<string, number> = {};
            data.forEach((l: any) => { initialDrafts[l.id] = l.coinPercentage; });
            setDraftPercentages(initialDrafts);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleRespond(linkId: string, approve: boolean) {
        setUpdating(linkId);
        try {
            await apiFetch(`/links/${linkId}/respond`, {
                method: 'PATCH',
                body: JSON.stringify({ approve }),
            });
            await loadLinks();
        } catch (err: any) {
            alert('Erro: ' + err.message);
        } finally {
            setUpdating(null);
        }
    }

    /** Apenas atualiza o estado LOCAL — não chama a API */
    function handleSliderChange(linkId: string, value: number) {
        setDraftPercentages(prev => ({ ...prev, [linkId]: value }));
    }

    /** Só é chamado ao clicar em "Confirmar" */
    async function handleConfirmPercentage(linkId: string) {
        const value = draftPercentages[linkId] ?? 0;
        setUpdating(linkId);
        try {
            await apiFetch(`/links/${linkId}/percentage`, {
                method: 'PATCH',
                body: JSON.stringify({ percentage: value }),
            });
            // Atualiza o estado oficial da lista com o valor confirmado
            setLinks(prev => prev.map(l => l.id === linkId ? { ...l, coinPercentage: value } : l));
        } catch (err: any) {
            alert('Erro ao confirmar: ' + err.message);
            // Reverte o draft para o valor salvo em caso de erro
            setDraftPercentages(prev => ({
                ...prev,
                [linkId]: links.find(l => l.id === linkId)?.coinPercentage ?? 0,
            }));
        } finally {
            setUpdating(null);
        }
    }

    /** Cancela o rascunho e reverte o slider para o valor salvo */
    function handleCancelDraft(linkId: string) {
        const saved = links.find(l => l.id === linkId)?.coinPercentage ?? 0;
        setDraftPercentages(prev => ({ ...prev, [linkId]: saved }));
    }

    const pending = links.filter(l => l.status === 'PENDING');
    const approved = links.filter(l => l.status === 'APPROVED');
    const rejected = links.filter(l => l.status === 'REJECTED');

    if (loading) return <div className="flex items-center justify-center min-h-screen font-black text-mais-navy uppercase tracking-widest animate-pulse">Carregando equipe...</div>;

    return (
        <div className="min-h-screen bg-mais-navy/5 pb-20">
            <nav className="bg-mais-navy p-4 text-white shadow-lg sticky top-0 z-50">
                <div className="max-w-5xl mx-auto flex justify-between items-center px-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.push('/dashboard')} className="hover:opacity-70 transition-opacity">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7" /></svg>
                        </button>
                        <h1 className="text-sm font-black uppercase tracking-widest">Gestão de <span className="text-mais-orange">Equipe</span></h1>
                    </div>
                    {pending.length > 0 && (
                        <span className="bg-mais-orange text-mais-navy text-[10px] font-black px-3 py-1 rounded-full animate-pulse">
                            {pending.length} pendente{pending.length > 1 ? 's' : ''}
                        </span>
                    )}
                </div>
            </nav>

            <main className="max-w-5xl mx-auto p-4 sm:p-8 space-y-12">

                {/* -------- PENDENTES -------- */}
                {pending.length > 0 && (
                    <section>
                        <div className="mb-6">
                            <h2 className="text-3xl font-black text-mais-navy uppercase tracking-tighter">⏳ Solicitações Pendentes</h2>
                            <p className="text-gray-400 text-sm font-medium mt-1 italic">Aprove ou recuse as solicitações de vínculo dos seus vendedores.</p>
                        </div>
                        <div className="space-y-4">
                            {pending.map(link => (
                                <div key={link.id} className="bg-white rounded-[2rem] p-8 shadow-xl border-2 border-yellow-200 flex flex-col gap-5">
                                    <div className="flex items-center justify-between gap-6">
                                        <div>
                                            <p className="font-black text-mais-navy uppercase text-lg">{link.seller?.name}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{link.seller?.document}</p>
                                            <p className="text-xs text-gray-400 font-medium mt-1">{link.seller?.email}</p>
                                            <p className="text-[10px] text-gray-300 uppercase font-bold tracking-widest mt-2">Solicitado em {new Date(link.createdAt).toLocaleDateString('pt-BR')}</p>
                                        </div>
                                        <div className="flex gap-3 flex-shrink-0">
                                            <button
                                                disabled={updating === link.id}
                                                onClick={() => handleRespond(link.id, true)}
                                                className="bg-mais-orange text-mais-navy px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all disabled:opacity-50 shadow-lg shadow-mais-orange/20"
                                            >
                                                Aprovar
                                            </button>
                                            <button
                                                disabled={updating === link.id}
                                                onClick={() => handleRespond(link.id, false)}
                                                className="bg-red-50 text-red-600 border-2 border-red-100 px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-100 transition-all disabled:opacity-50"
                                            >
                                                Recusar
                                            </button>
                                        </div>
                                    </div>
                                    {link.standbyInvoiceCount > 0 && (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-start gap-3">
                                            <span className="text-xl">⏸️</span>
                                            <div>
                                                <p className="text-xs font-black text-yellow-700 uppercase tracking-widest">
                                                    {link.standbyInvoiceCount} NF{link.standbyInvoiceCount > 1 ? 's' : ''} aguardando aprovação
                                                </p>
                                                <p className="text-[11px] text-yellow-600 mt-1 font-medium">
                                                    Nenhum coin foi contabilizado ainda. Ao aprovar e configurar a porcentagem, as notas serão processadas automaticamente.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* -------- APROVADOS -------- */}
                <section>
                    <div className="mb-6">
                        <h2 className="text-3xl font-black text-mais-navy uppercase tracking-tighter">✅ Equipe Ativa</h2>
                        <p className="text-gray-400 text-sm font-medium mt-1 italic">Configure a % de coins de cada vendedor vinculado.</p>
                    </div>
                    {approved.length === 0 ? (
                        <div className="bg-white rounded-[2rem] p-12 text-center border-2 border-dashed border-gray-100 shadow-xl">
                            <p className="text-gray-400 font-bold uppercase italic text-sm">Nenhum vendedor aprovado ainda.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {approved.map(link => {
                                const draft = draftPercentages[link.id] ?? link.coinPercentage;
                                const isDirty = draft !== link.coinPercentage; // tem alteração não confirmada

                                return (
                                    <div key={link.id} className={`bg-white rounded-[2rem] p-8 shadow-xl border-2 relative transition-all ${isDirty ? 'border-mais-orange/60 shadow-mais-orange/10' : 'border-mais-orange/20'}`}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-black text-mais-navy uppercase text-sm">{link.seller?.name}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{link.seller?.document}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Saldo</p>
                                                <p className="text-lg font-black text-mais-orange">{link.seller?.coinBalance} <span className="text-[10px]">Mais Coins</span></p>
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Porcentagem para o Vendedor</p>
                                                <div className="flex items-center gap-2">
                                                    {isDirty && (
                                                        <span className="text-[9px] font-black text-mais-orange bg-mais-orange/10 px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">
                                                            Não salvo
                                                        </span>
                                                    )}
                                                    <p className="text-2xl font-black text-mais-navy">{draft}<span className="text-sm">%</span></p>
                                                </div>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                step="5"
                                                value={draft}
                                                onChange={(e) => handleSliderChange(link.id, Number(e.target.value))}
                                                className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-mais-orange"
                                                disabled={updating === link.id}
                                            />
                                            <div className="flex justify-between text-[9px] text-gray-300 font-bold uppercase mt-1">
                                                <span>0% (tudo para empresa)</span>
                                                <span>100% (tudo para vendedor)</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex gap-3 text-[10px] font-black uppercase tracking-widest">
                                            <span className="flex-1 bg-mais-navy/5 text-mais-navy text-center py-2 rounded-xl">Empresa: {100 - draft}%</span>
                                            <span className="flex-1 bg-mais-orange/10 text-mais-orange text-center py-2 rounded-xl">Vendedor: {draft}%</span>
                                        </div>

                                        {/* Botões de confirmação — só aparecem quando há alteração não salva */}
                                        {isDirty && (
                                            <div className="mt-4 flex gap-3">
                                                <button
                                                    onClick={() => handleConfirmPercentage(link.id)}
                                                    disabled={updating === link.id}
                                                    className="flex-1 bg-mais-orange text-mais-navy py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] transition-all disabled:opacity-50 shadow-lg shadow-mais-orange/20"
                                                >
                                                    {updating === link.id ? 'Salvando...' : '✓ Confirmar'}
                                                </button>
                                                <button
                                                    onClick={() => handleCancelDraft(link.id)}
                                                    disabled={updating === link.id}
                                                    className="px-4 py-3 rounded-2xl border-2 border-gray-100 text-gray-400 font-black uppercase text-xs tracking-widest hover:border-gray-200 hover:text-gray-500 transition-all disabled:opacity-50"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        )}

                                        {link.standbyInvoiceCount > 0 && link.coinPercentage === 0 && (
                                            <div className="mt-4 bg-orange-50 border border-orange-200 rounded-2xl p-3 flex items-start gap-2">
                                                <span className="text-base">⏸️</span>
                                                <p className="text-[11px] text-orange-600 font-medium">
                                                    <span className="font-black">{link.standbyInvoiceCount} NF{link.standbyInvoiceCount > 1 ? 's' : ''} em espera.</span> Confirme uma porcentagem para liberar os coins automaticamente.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* -------- REJEITADOS -------- */}
                {rejected.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-black text-gray-300 uppercase tracking-tighter mb-4">❌ Recusados</h2>
                        <div className="space-y-3">
                            {rejected.map(link => (
                                <div key={link.id} className="bg-white rounded-2xl p-6 shadow border border-gray-100 flex justify-between items-center opacity-60">
                                    <div>
                                        <p className="font-bold text-gray-400 uppercase text-sm">{link.seller?.name}</p>
                                        <p className="text-[10px] text-gray-300 font-bold">{link.seller?.document}</p>
                                    </div>
                                    <span className="text-[10px] font-black bg-red-50 text-red-400 px-3 py-1 rounded-full uppercase tracking-widest border border-red-100">Recusado</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
