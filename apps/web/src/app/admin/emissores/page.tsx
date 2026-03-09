'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api-client';

interface Emitter {
    id: string;
    cnpj: string;
    name: string;
    active: boolean;
    createdAt: string;
}

function formatCnpj(cnpj: string) {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

export default function EmissoresPage() {
    const router = useRouter();
    const [emitters, setEmitters] = useState<Emitter[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);

    // Form state
    const [cnpj, setCnpj] = useState('');
    const [name, setName] = useState('');
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.role !== 'ADMIN') { router.push('/admin/login'); return; }
        loadEmitters();
    }, [router]);

    async function loadEmitters() {
        try {
            const data: any = await apiFetch('/allowed-emitters');
            setEmitters(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        setFormError('');
        setFormSuccess('');
        setSaving('new');
        try {
            await apiFetch('/allowed-emitters', {
                method: 'POST',
                body: JSON.stringify({ cnpj: cnpj.replace(/\D/g, ''), name }),
            });
            setCnpj('');
            setName('');
            setFormSuccess('Emissor cadastrado com sucesso!');
            await loadEmitters();
        } catch (err: any) {
            setFormError(err.message);
        } finally {
            setSaving(null);
        }
    }

    async function handleToggle(id: string) {
        setSaving(id);
        try {
            await apiFetch(`/allowed-emitters/${id}/toggle`, { method: 'PATCH' });
            await loadEmitters();
        } finally {
            setSaving(null);
        }
    }

    async function handleRemove(id: string, emitterName: string) {
        if (!confirm(`Remover "${emitterName}" da lista de emissores autorizados?`)) return;
        setSaving(id);
        try {
            await apiFetch(`/allowed-emitters/${id}`, { method: 'DELETE' });
            await loadEmitters();
        } finally {
            setSaving(null);
        }
    }

    const active = emitters.filter(e => e.active);
    const inactive = emitters.filter(e => !e.active);

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <p className="font-black text-mais-navy uppercase tracking-widest animate-pulse">Carregando...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Nav */}
            <nav className="bg-mais-navy text-white px-8 py-4 flex items-center justify-between shadow-lg sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push('/admin')} className="hover:opacity-70 transition-opacity">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="font-black uppercase tracking-widest text-sm">
                        Emissores <span className="text-mais-orange">Autorizados</span>
                    </h1>
                </div>
                <span className="text-xs font-bold text-white/50 uppercase tracking-widest">
                    {active.length} ativo{active.length !== 1 ? 's' : ''}
                </span>
            </nav>

            <main className="max-w-4xl mx-auto p-6 sm:p-10 space-y-10">

                {/* Formulário de adição */}
                <div className="bg-white rounded-[2rem] shadow-xl p-8 border-2 border-mais-orange/20">
                    <h2 className="text-xl font-black text-mais-navy uppercase tracking-tight mb-6">
                        ➕ Adicionar Emissor
                    </h2>
                    <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">CNPJ</label>
                            <input
                                required
                                type="text"
                                placeholder="00.000.000/0000-00"
                                value={cnpj}
                                onChange={e => setCnpj(e.target.value)}
                                maxLength={18}
                                className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-mono focus:border-mais-orange focus:outline-none"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nome da Empresa</label>
                            <input
                                required
                                type="text"
                                placeholder="Ex: Mais Corporativo — Filial/RJ"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-mais-orange focus:outline-none"
                            />
                        </div>
                        {formError && (
                            <div className="sm:col-span-3 bg-red-50 border border-red-100 text-red-600 text-xs font-medium px-4 py-3 rounded-xl">
                                ⚠️ {formError}
                            </div>
                        )}
                        {formSuccess && (
                            <div className="sm:col-span-3 bg-green-50 border border-green-100 text-green-700 text-xs font-medium px-4 py-3 rounded-xl">
                                ✅ {formSuccess}
                            </div>
                        )}
                        <div className="sm:col-span-3 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving === 'new'}
                                className="bg-mais-orange text-mais-navy px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all disabled:opacity-50 shadow-lg shadow-mais-orange/20"
                            >
                                {saving === 'new' ? 'Salvando...' : 'Cadastrar CNPJ'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Lista de ativos */}
                <section>
                    <h2 className="text-2xl font-black text-mais-navy uppercase tracking-tighter mb-4">
                        ✅ Emissores Ativos <span className="text-mais-orange">({active.length})</span>
                    </h2>
                    {active.length === 0 ? (
                        <div className="bg-white rounded-2xl p-10 text-center border-2 border-dashed border-gray-100">
                            <p className="text-gray-400 italic text-sm">Nenhum emissor ativo cadastrado.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {active.map(emitter => (
                                <div key={emitter.id} className="bg-white rounded-2xl px-6 py-4 shadow border border-mais-orange/20 flex items-center justify-between gap-4">
                                    <div>
                                        <p className="font-black text-mais-navy text-sm">{emitter.name}</p>
                                        <p className="text-xs font-mono text-gray-400 mt-0.5">{formatCnpj(emitter.cnpj)}</p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => handleToggle(emitter.id)}
                                            disabled={saving === emitter.id}
                                            className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all disabled:opacity-50"
                                        >
                                            Desativar
                                        </button>
                                        <button
                                            onClick={() => handleRemove(emitter.id, emitter.name)}
                                            disabled={saving === emitter.id}
                                            className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all disabled:opacity-50"
                                        >
                                            Remover
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Lista de inativos */}
                {inactive.length > 0 && (
                    <section>
                        <h2 className="text-lg font-black text-gray-300 uppercase tracking-tighter mb-3">
                            ⏸ Inativos ({inactive.length})
                        </h2>
                        <div className="space-y-3">
                            {inactive.map(emitter => (
                                <div key={emitter.id} className="bg-white rounded-2xl px-6 py-4 shadow border border-gray-100 flex items-center justify-between gap-4 opacity-50">
                                    <div>
                                        <p className="font-bold text-gray-400 text-sm">{emitter.name}</p>
                                        <p className="text-xs font-mono text-gray-300 mt-0.5">{formatCnpj(emitter.cnpj)}</p>
                                    </div>
                                    <button
                                        onClick={() => handleToggle(emitter.id)}
                                        disabled={saving === emitter.id}
                                        className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-mais-orange/10 text-mais-orange hover:bg-mais-orange/20 transition-all disabled:opacity-50"
                                    >
                                        Reativar
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
