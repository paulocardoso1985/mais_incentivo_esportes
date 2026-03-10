const { spawn } = require('child_process');

/**
 * Script para rodar API (Backend) e Web (Frontend) simultaneamente
 * no mesmo container do Railway.
 */

function startService(name, command, args, cwd, extraEnv = {}) {
    console.log(`[${name}] Iniciando servico em ${cwd}...`);

    // Garantimos que o ambiente atual seja passado e mesclado com extras
    const serviceEnv = {
        ...process.env,
        ...extraEnv
    };

    const child = spawn(command, args, {
        stdio: 'inherit',
        cwd: cwd,
        shell: true,
        env: serviceEnv
    });

    child.on('error', (err) => {
        console.error(`[${name}] ERRO AO INICIAR PROCESSO:`, err);
    });

    child.on('exit', (code) => {
        console.error(`[${name}] Servico encerrou com codigo: ${code}`);
        // Se um dos serviços morrer, paramos tudo para o Railway reiniciar o container
        process.exit(code || 1);
    });

    return child;
}

async function main() {
    console.log("=== INICIANDO COMBO (API + WEB) ===");

    // Log de diagnóstico
    const envKeys = Object.keys(process.env).filter(k => !k.includes('TOKEN') && !k.includes('SECRET') && !k.includes('PASS'));
    console.log("Variaveis de ambiente disponiveis (keys):", envKeys.join(', '));
    console.log("Status de variaveis criticas:", {
        PORT: process.env.PORT,
        DATABASE_URL: !!process.env.DATABASE_URL ? "OK" : "AUSENTE",
        JWT_SECRET: !!process.env.JWT_SECRET ? "OK" : "AUSENTE (ERRO!)",
    });

    // 1. Rodar migrações do banco (via Prisma)
    console.log("[DATABASE] Verificando banco...");
    const migrate = spawn('npx', ['prisma', 'db', 'push'], {
        stdio: 'inherit',
        cwd: '/app/packages/database',
        shell: true
    });

    migrate.on('exit', (code) => {
        if (code !== 0) {
            console.error("[DATABASE] Aviso: Falha no db push. Prosseguindo...");
        }

        console.log("[DATABASE] Rodando seed...");
        const seed = spawn('npx', ['prisma', 'db', 'seed'], {
            stdio: 'inherit',
            cwd: '/app/packages/database',
            shell: true
        });

        seed.on('exit', () => {
            console.log("[DATABASE] Setup concluido. Iniciando servicos...");

            // 2. Iniciar API e Web simultaneamente

            // API - Porta interna 3005
            startService('API', 'node', ['apps/api/dist/main.js'], '/app', {
                PORT: '3005'
            });

            // WEB - Porta padrão do Railway (geralmente 8080 ou 3000)
            // HOSTNAME 0.0.0.0 é OBRIGATÓRIO para o Railway
            startService('WEB', 'node', ['apps/web/server.js'], '/app', {
                HOSTNAME: '0.0.0.0'
            });
        });
    });
}

main();
