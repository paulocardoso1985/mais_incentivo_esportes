'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import { useRouter, useParams } from 'next/navigation';

export default function EditarPacotePage() {
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        title: '',
        championship: '',
        teamMatch: '',
        eventDate: '',
        priceCoins: 0,
        stock: 0,
        location: '',
        description: '',
        imageUrl: '',
        hasAirfare: false,
        hasHotel: false,
        hasTransfer: false,
        hasFood: false,
        region: '',
        city: '',
        departureAirport: '',
        flightsInfo: '',
        connectionNotice: false,
        additionalFlightCost: 0,
        catalogPdfUrl: '',
    });

    useEffect(() => {
        async function loadPackage() {
            try {
                const data: any = await apiFetch(`/events/${id}`);
                // Format eventDate for datetime-local input
                const date = new Date(data.eventDate);
                const offset = date.getTimezoneOffset() * 60000;
                const localISODate = new Date(date.getTime() - offset).toISOString().slice(0, 16);

                setForm({
                    ...data,
                    eventDate: localISODate
                });
            } catch (err: any) {
                setError('Erro ao carregar pacote: ' + err.message);
            } finally {
                setLoading(false);
            }
        }
        if (id) loadPackage();
    }, [id]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            await apiFetch(`/events/cms/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(form),
            });
            router.push('/admin/pacotes');
        } catch (err: any) {
            setError(err.message);
            setSaving(false);
        }
    }

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
        }));
    };

    if (loading) return <div className="p-20 text-center animate-pulse font-black text-mais-navy uppercase">Buscando dados do pacote...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            <nav className="bg-mais-navy p-4 text-white shadow-xl">
                <div className="max-w-4xl mx-auto flex items-center px-4">
                    <button onClick={() => router.back()} className="mr-4 hover:opacity-80">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h1 className="text-xl font-black uppercase tracking-tight">Editar <span className="text-mais-orange">Pacote</span></h1>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto p-4 mt-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Bloco 1: Informações Básicas */}
                    <section className="bg-white p-8 rounded-[2rem] shadow-2xl border border-gray-100">
                        <h3 className="text-lg font-black text-mais-navy uppercase mb-6 flex items-center tracking-tight">
                            <span className="w-8 h-8 bg-mais-navy/10 text-mais-navy rounded-full flex items-center justify-center mr-3 text-xs italic">01</span>
                            Dados do Evento
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Título do Pacote</label>
                                <input name="title" required value={form.title} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:border-mais-orange transition-all font-medium" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Campeonato</label>
                                <input name="championship" required value={form.championship} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:border-mais-orange transition-all font-medium" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Confronto (Jogo)</label>
                                <input name="teamMatch" required value={form.teamMatch} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:border-mais-orange transition-all font-medium" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Data e Hora</label>
                                <input name="eventDate" type="datetime-local" required value={form.eventDate} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:border-mais-orange transition-all font-medium" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Local / Estádio</label>
                                <input name="location" required value={form.location} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:border-mais-orange transition-all font-medium" />
                            </div>
                        </div>
                    </section>

                    {/* Bloco 2: Regionalização */}
                    <section className="bg-white p-8 rounded-[2rem] shadow-2xl border border-gray-100">
                        <h3 className="text-lg font-black text-mais-navy uppercase mb-6 flex items-center tracking-tight">
                            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 text-xs italic">02</span>
                            Regionalização
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Região de Exibição</label>
                                <select name="region" value={form.region} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:border-mais-orange transition-all font-medium">
                                    <option value="">Selecione...</option>
                                    <option value="Nacional">Nacional (Todo o Brasil)</option>
                                    <option value="Norte">Norte</option>
                                    <option value="Nordeste">Nordeste</option>
                                    <option value="Centro-Oeste">Centro-Oeste</option>
                                    <option value="Sudeste">Sudeste</option>
                                    <option value="Sul">Sul</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Cidade do Evento</label>
                                <input name="city" value={form.city} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:border-mais-orange transition-all font-medium" placeholder="Ex: Belém, Fortaleza..." />
                            </div>
                        </div>
                    </section>

                    {/* Bloco 3: Itens Inclusos (Modularidade) */}
                    <section className="bg-white p-8 rounded-[2rem] shadow-2xl border border-gray-100">
                        <h3 className="text-lg font-black text-mais-navy uppercase mb-6 flex items-center tracking-tight">
                            <span className="w-8 h-8 bg-mais-orange/10 text-mais-orange rounded-full flex items-center justify-center mr-3 text-xs italic">03</span>
                            O que está incluso?
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { id: 'hasAirfare', label: 'Passagem Aérea', icon: '✈️' },
                                { id: 'hasHotel', label: 'Hospedagem', icon: '🏨' },
                                { id: 'hasTransfer', label: 'Translado', icon: '🚐' },
                                { id: 'hasFood', label: 'Ingresso', icon: '🏟️' },
                            ].map((item) => (
                                <label key={item.id} className={`cursor-pointer group flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${form[item.id as keyof typeof form] ? 'bg-mais-orange/10 border-mais-orange' : 'bg-gray-50 border-gray-50 hover:bg-white hover:border-mais-orange/30'}`}>
                                    <input type="checkbox" name={item.id} checked={form[item.id as keyof typeof form] as boolean} onChange={handleChange} className="hidden" />
                                    <span className="text-2xl mb-2 grayscale group-hover:grayscale-0">{item.icon}</span>
                                    <span className="text-[10px] font-black text-mais-navy uppercase text-center">{item.label}</span>
                                    <div className={`mt-2 w-10 h-1.5 rounded-full transition-all ${form[item.id as keyof typeof form] ? 'bg-mais-orange' : 'bg-gray-200'}`} />
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* Bloco 4: Logística e Voos */}
                    <section className="bg-white p-8 rounded-[2rem] shadow-2xl border border-gray-100">
                        <h3 className="text-lg font-black text-mais-navy uppercase mb-6 flex items-center tracking-tight">
                            <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-3 text-xs italic">04</span>
                            Logística de Viagem
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Aeroporto de Saída</label>
                                <input name="departureAirport" value={form.departureAirport} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:border-mais-orange transition-all font-medium" placeholder="Ex: GRU, FOR, Belém..." />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Custo Adicional de Voo (Coins)</label>
                                <input name="additionalFlightCost" type="number" value={form.additionalFlightCost} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:border-mais-orange transition-all font-black" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Informações sobre os Voos</label>
                                <textarea name="flightsInfo" rows={2} value={form.flightsInfo} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:border-mais-orange transition-all font-medium" placeholder="Ex: Voos saindo apenas de Guarulhos e Fortaleza..." />
                            </div>
                            <div className="md:col-span-2 flex items-center gap-3 bg-red-50 p-4 rounded-[1.5rem] border border-red-100">
                                <input type="checkbox" id="connectionNotice" name="connectionNotice" checked={form.connectionNotice} onChange={handleChange} className="w-5 h-5 accent-red-600" />
                                <div className="flex flex-col">
                                    <label htmlFor="connectionNotice" className="text-xs font-black text-red-600 uppercase tracking-widest leading-none mb-1">Exibir alerta de conexões?</label>
                                    <p className="text-[10px] text-red-400 font-medium leading-tight italic">Ative se o participante for responsável por verificar conexões internas.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Bloco 5: Economia */}
                    <section className="bg-white p-8 rounded-[2rem] shadow-2xl border border-gray-100">
                        <h3 className="text-lg font-black text-mais-navy uppercase mb-6 flex items-center tracking-tight">
                            <span className="w-8 h-8 bg-mais-red/10 text-mais-red rounded-full flex items-center justify-center mr-3 text-xs italic">05</span>
                            Regras e Valores
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Preço em Mais Coins</label>
                                <input name="priceCoins" type="number" required value={form.priceCoins} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 focus:bg-white focus:border-mais-orange transition-all font-black text-xl text-mais-navy" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Estoque (Vagas)</label>
                                <input name="stock" type="number" required value={form.stock} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 focus:bg-white focus:border-mais-orange transition-all font-black" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Descrição Adicional (Opcional)</label>
                                <textarea name="description" rows={3} value={form.description} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:border-mais-orange transition-all font-medium" placeholder="Informações detalhadas sobre o pacote..." />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">URL da Imagem de Capa</label>
                                <input name="imageUrl" value={form.imageUrl} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:border-mais-orange transition-all font-medium" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Catálogo PDF Adicional (URL)</label>
                                <input name="catalogPdfUrl" value={form.catalogPdfUrl} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:border-mais-navy transition-all font-medium" />
                            </div>
                        </div>
                    </section>

                    {error && <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-xs font-bold uppercase">{error}</div>}

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-mais-navy text-white py-6 rounded-[2.5rem] font-black text-xl shadow-2xl shadow-mais-navy/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 uppercase tracking-widest"
                    >
                        {saving ? 'Salvando Alterações...' : 'Atualizar Pacote'}
                    </button>
                </form>
            </main>
        </div>
    );
}
