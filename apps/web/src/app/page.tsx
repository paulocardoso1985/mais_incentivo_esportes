export default function Home() {
    return (
        <main className="min-h-screen bg-mais-navy flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-mais-orange/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-mais-orange/5 rounded-full blur-3xl -ml-48 -mb-48"></div>

            <div className="z-10 max-w-4xl w-full text-center">
                <header className="mb-16">
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic">
                        Mais Corporativo <span className="text-mais-orange">Esportes</span>
                    </h1>
                    <div className="mt-4 inline-block bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20">
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-white/60">Central de Acessos MVP 1.0</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Card Participante */}
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group hover:-translate-y-2 transition-all duration-500">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                            <svg className="w-24 h-24 text-mais-navy" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                        </div>

                        <div className="text-left relative z-10">
                            <span className="bg-mais-navy/5 text-mais-navy text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Portal do Participante</span>
                            <h2 className="text-3xl font-black text-mais-navy mt-4 uppercase leading-none">Lojista & Vendedor</h2>
                            <p className="text-gray-500 mt-4 text-sm font-medium leading-relaxed">
                                Área para envio de notas fiscais, consulta de saldo, extrato e resgate de experiências exclusivas.
                            </p>

                            <div className="mt-10 flex flex-col gap-3">
                                <a href="/login" className="bg-mais-navy text-white text-center py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-mais-navy/90 shadow-lg transition-all">
                                    Fazer Login
                                </a>
                                <a href="/register" className="bg-gray-100 text-mais-navy text-center py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all">
                                    Criar Nova Conta
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Card Administração */}
                    <div className="bg-mais-navy border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group hover:-translate-y-2 transition-all duration-500">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg>
                        </div>

                        <div className="text-left relative z-10">
                            <span className="bg-mais-orange text-mais-navy text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Painel de Controle</span>
                            <h2 className="text-3xl font-black text-white mt-4 uppercase leading-none">Administração</h2>
                            <p className="text-white/40 mt-4 text-sm font-medium leading-relaxed">
                                Gestão completa de usuários, pacotes de viagens, controle de pedidos e auditoria de notas.
                            </p>

                            <div className="mt-10">
                                <a href="/admin/login" className="block bg-mais-orange text-mais-navy text-center py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all shadow-lg shadow-mais-orange/20">
                                    Acessar CRM Admin
                                </a>
                                <p className="text-center text-[10px] text-white/30 mt-6 font-bold uppercase tracking-widest italic">
                                    Acesso restrito à equipe Mais Corporativo
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="mt-20">
                    <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.5em]">2026 © Mais Corporativo Esportes</p>
                </footer>
            </div>
        </main>
    );
}
