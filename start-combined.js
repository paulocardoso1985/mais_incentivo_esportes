const { spawn } = require('child_process');
const http = require('http');

/**
 * Script para rodar API (Backend) e Web (Frontend) simultaneamente
 * no mesmo container do Railway.
 */

function startService(name, command, args, cwd, extraEnv = {}) {
    console.log(`[${name}] Iniciando servico em ${cwd}...`);

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
        process.exit(code || 1);
    });

    return child;
}

// Timer para manter o log ativo e mostrar que o container está vivo
setInterval(() => {
    console.log(`[MONITOR] Container vivo em ${new Date().toISOString()} - Aguardando conexoes na porta ${process.env.PORT || '8080'}`);
}, 30000);

async function main() {
    console.log("=== INICIANDO COMBO (API + WEB) ===");

    // Log de diagnóstico expandido
    console.log("Configuracao de Rede:", {
        RAILWAY_PORT: process.env.PORT,
        TARGET_HOSTNAME: '0.0.0.0', // Obrigatorio para Railway
        NODE_ENV: process.env.NODE_ENV
    });

    const envKeys = Object.keys(process.env).filter(k => !k.includes('TOKEN') && !k.includes('SECRET') && !k.includes('PASS'));
    console.log("Variaveis de ambiente disponiveis (keys):", envKeys.join(', '));

    console.log("Status de variaveis criticas:", {
        DATABASE_URL: !!process.env.DATABASE_URL ? "OK" : "AUSENTE",
        JWT_SECRET: !!process.env.JWT_SECRET ? "OK" : "USANDO FALLBACK (NO CODIGO)",
    });

    // 1. Rodar migrações do banco (via Prisma)
    console.log("[DATABASE] Verificando banco...");
    const migrate = spawn('npx', ['prisma', 'db', 'push'], {
        stdio: 'inherit',
        cwd: '/app/packages/database',
        shell: true
    });

    migrate.on('exit', (code) => {
        console.log("[DATABASE] Prisma DB Push finalizado.");

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
            // Note: A API tem fallback de porta no main.ts se PORT for injetada globalmente
            startService('API', 'node', ['apps/api/dist/main.js'], '/app', {
                PORT: '3005'
            });

            // WEB - Porta principal
            // Forçamos a porta do Railway explicitamente
            const webPort = process.env.PORT || '8080';
            console.log(`[WEB] Tentando bind em 0.0.0.0:${webPort}`);

            startService('WEB', 'node', ['apps/web/server.js'], '/app', {
                HOSTNAME: '0.0.0.0',
                PORT: webPort
            });
        });
    });
}

main();
