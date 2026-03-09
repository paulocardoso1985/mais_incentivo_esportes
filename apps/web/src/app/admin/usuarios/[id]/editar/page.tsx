'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import { useRouter, useParams } from 'next/navigation';

export default function EditarUsuarioPage() {
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        name: '',
        email: '',
        document: '',
        role: '',
        coinBalance: 0,
    });

    useEffect(() => {
        async function loadUser() {
            try {
                // Fetch user data via API
                // Note: We use the list endpoint or a specific one? The CMS has list. 
                // Let's assume we can fetch by ID or filter from list.
                // For simplicity in a flat API, I'll fetch the whole list and find the user or use the findById logic if exposed.
                // The backend has findById but not a public CMS findById yet. I'll add it or just use the list.
                // Actually, let's just make the backend robust.
                const allUsers: any = await apiFetch('/profile/cms/list');
                const user = allUsers.find((u: any) => u.id === id);
                if (!user) throw new Error('Usuário não encontrado');

                setForm({
                    name: user.name,
                    email: user.email,
                    document: user.document,
                    role: user.role,
                    coinBalance: user.coinBalance,
                });
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        if (id) loadUser();
    }, [id]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            await apiFetch(`/profile/cms/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(form),
            });
            router.push('/admin/usuarios');
        } catch (err: any) {
            setError(err.message);
            setSaving(false);
        }
    }

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: name === 'coinBalance' ? Number(value) : value }));
    };

    if (loading) return <div className="p-20 text-center animate-pulse font-black text-mais-navy uppercase tracking-widest text-xs">Carregando perfil...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <aside className="w-64 bg-mais-navy text-white p-8 hidden lg:block">
                <h1 className="text-xl font-black uppercase italic tracking-tighter mb-12">CMS <span className="text-mais-orange">Gestão</span></h1>
                <nav className="space-y-6">
                    <button onClick={() => router.push('/admin/pacotes')} className="block w-full text-left text-sm font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-all">Catálogo de Prêmios</button>
                    <button onClick={() => router.push('/admin/usuarios')} className="block w-full text-left text-sm font-bold uppercase tracking-widest text-mais-orange underline underline-offset-8">Gestão de Usuários</button>
                    <div className="pt-20">
                        <button onClick={() => router.push('/dashboard')} className="text-xs font-black text-white/40 uppercase tracking-widest hover:text-white">Voltar ao App</button>
                    </div>
                </nav>
            </aside>

            <main className="flex-1 p-4 sm:p-12">
                <header className="mb-10">
                    <button onClick={() => router.back()} className="text-mais-navy mb-4 flex items-center text-xs font-black uppercase tracking-widest hover:opacity-70 transition-opacity">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                        Voltar
                    </button>
                    <h2 className="text-4xl font-black text-mais-navy uppercase">Editar Usuário</h2>
                    <p className="text-gray-500 mt-2">Ajuste dados cadastrais, saldo de coins ou nível de acesso.</p>
                </header>

                <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-10 rounded-[2rem] shadow-2xl border border-gray-100 space-y-6">
                    {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl text-xs font-bold uppercase border border-red-100">{error}</div>}

                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Papel / Permissão</label>
                            <select name="role" value={form.role} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-4 py-4 text-mais-navy font-bold focus:border-mais-navy transition-all">
                                <option value="CPF_SELLER">Vendedor (CPF)</option>
                                <option value="CNPJ_MASTER">Dono de Loja (CNPJ)</option>
                                <option value="REPRESENTATIVE">Representante</option>
                                <option value="ADMIN">Administrador (CMS)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nome / Razão Social</label>
                            <input name="name" value={form.name} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-4 py-4 text-mais-navy font-medium focus:border-mais-navy transition-all" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">E-mail</label>
                                <input name="email" value={form.email} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-4 py-4 text-mais-navy font-medium focus:border-mais-navy transition-all" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Saldo de Coins</label>
                                <input name="coinBalance" type="number" value={form.coinBalance} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-4 py-4 text-mais-navy font-black focus:border-mais-navy transition-all" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Documento (CPF/CNPJ)</label>
                            <input name="document" value={form.document} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-4 py-4 text-mais-navy font-medium focus:border-mais-navy transition-all" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-mais-navy text-white py-5 rounded-2xl font-black text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 uppercase tracking-widest mt-8"
                    >
                        {saving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </form>
            </main>
        </div>
    );
}
