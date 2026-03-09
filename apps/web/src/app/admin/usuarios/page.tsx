'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

export default function AdminUsuariosPage() {
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser || JSON.parse(storedUser).role !== 'ADMIN') {
            router.push('/admin/login');
            return;
        }

        async function loadUsers() {
            try {
                const data: any = await apiFetch('/profile/cms/list');
                setUsers(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadUsers();
    }, [router]);

    async function handleUpdateRole(id: string, newRole: string) {
        try {
            await apiFetch(`/profile/cms/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ role: newRole }),
            });
            setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
        } catch (err: any) {
            alert('Erro ao atualizar papel: ' + err.message);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Deseja realmente remover este usuário? Esta ação é irreversível.')) return;
        try {
            await apiFetch(`/profile/cms/${id}`, { method: 'DELETE' });
            setUsers(users.filter(u => u.id !== id));
        } catch (err: any) {
            alert('Erro ao remover usuário: ' + err.message);
        }
    }

    if (loading) return <div className="p-20 text-center animate-pulse font-black text-mais-navy uppercase tracking-widest">Carregando usuários...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar Simples */}
            <aside className="w-64 bg-mais-navy text-white p-8 hidden lg:block">
                <h1 className="text-xl font-black uppercase italic tracking-tighter mb-12">CMS <span className="text-mais-orange">Gestão</span></h1>
                <nav className="space-y-6">
                    <button onClick={() => router.push('/admin/pacotes')} className="block w-full text-left text-sm font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-all">Catálogo de Prêmios</button>
                    <button onClick={() => router.push('/admin/pedidos')} className="block w-full text-left text-sm font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-all">Gestão de Pedidos</button>
                    <button onClick={() => router.push('/admin/usuarios')} className="block w-full text-left text-sm font-bold uppercase tracking-widest text-mais-orange underline underline-offset-8">Gestão de Usuários</button>
                    <button onClick={() => router.push('/admin/emissores')} className="block w-full text-left text-sm font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-all">Emissores Autorizados</button>
                    <div className="pt-20 space-y-4">
                        <button onClick={() => router.push('/dashboard')} className="block text-xs font-black text-white/40 uppercase tracking-widest hover:text-white">Voltar ao App</button>
                        <button
                            onClick={() => {
                                localStorage.clear();
                                router.push('/admin/login');
                            }}
                            className="block text-xs font-black text-white/40 uppercase tracking-widest hover:text-red-400 transition-colors"
                        >
                            Sair do Painel
                        </button>
                    </div>
                </nav>
            </aside>

            <main className="flex-1 p-4 sm:p-12">
                <header className="mb-10 flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-black text-mais-navy uppercase">Usuários</h2>
                        <p className="text-gray-500 mt-2">Gerencie permissões e visualize todos os perfis cadastrados.</p>
                    </div>
                    <button
                        onClick={() => router.push('/admin/usuarios/novo')}
                        className="bg-mais-navy text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                    >
                        + Cadastrar Usuario
                    </button>
                </header>

                <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <tr>
                                    <th className="px-8 py-6">Nome / Documento</th>
                                    <th className="px-8 py-6">E-mail</th>
                                    <th className="px-8 py-6">Papel (Role)</th>
                                    <th className="px-8 py-6">Desde</th>
                                    <th className="px-8 py-6 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-mais-navy/[0.01] transition-colors group">
                                        <td className="px-8 py-6">
                                            <p className="font-black text-mais-navy uppercase text-sm">{user.name}</p>
                                            <p className="text-[10px] text-gray-400 font-bold tracking-widest">{user.document}</p>
                                        </td>
                                        <td className="px-8 py-6 text-sm text-gray-600 font-medium">
                                            {user.email}
                                        </td>
                                        <td className="px-8 py-6">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                                                className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border-2 transition-all ${user.role === 'ADMIN' ? 'bg-mais-orange/10 border-mais-orange text-green-800' : 'bg-mais-navy/10 border-mais-navy/30 text-mais-navy'}`}
                                            >
                                                <option value="CPF_SELLER">Vendedor (CPF)</option>
                                                <option value="CNPJ_MASTER">Dono de Loja (CNPJ)</option>
                                                <option value="REPRESENTATIVE">Representante</option>
                                                <option value="ADMIN">Administrador</option>
                                            </select>
                                        </td>
                                        <td className="px-8 py-6 text-[10px] text-gray-400 font-black uppercase">
                                            {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-8 py-6 text-right flex justify-end space-x-2">
                                            <button
                                                onClick={() => router.push(`/admin/usuarios/${user.id}/editar`)}
                                                className="text-gray-300 hover:text-mais-navy transition-colors p-2"
                                                title="Editar Usuário"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="text-gray-200 hover:text-red-500 transition-colors p-2"
                                                title="Remover Usuário"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
