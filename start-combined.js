const { spawn } = require('child_process');

/**
 * Script para rodar API (Backend) e Web (Frontend) simultaneamente
 * no mesmo container do Railway.
 */

function startService(name, command, args, cwd) {
    console.log(`[${name}] Iniciando servico...`);
    const child = spawn(command, args, {
        stdio: 'inherit',
        cwd: cwd,
        shell: true
    });

    child.on('exit', (code) => {
        console.error(`[${name}] Servico encerrou com codigo: ${code}`);
        process.exit(code || 1);
    });

    return child;
}

async function main() {
    console.log("=== INICIANDO COMBO (API + WEB) ===");

    // 1. Rodar migrações e seed do banco (via API/Prisma)
    console.log("[DATABASE] Rodando prisma db push...");
    const migrate = spawn('npx', ['prisma', 'db', 'push'], {
        stdio: 'inherit',
        cwd: '/app/packages/database',
        shell: true
    });

    migrate.on('exit', (code) => {
        if (code !== 0) {
            console.error("[DATABASE] Falha no db push. Verifique a DATABASE_URL.");
            process.exit(code);
        }

        console.log("[DATABASE] Banco sincronizado. Rodando seed...");
        const seed = spawn('npx', ['prisma', 'db', 'seed'], {
            stdio: 'inherit',
            cwd: '/app/packages/database',
            shell: true
        });

        seed.on('exit', (seedCode) => {
            console.log("[DATABASE] Seed concluido (ou ignorado).");

            // 2. Iniciar API e Web simultaneamente
            // API na porta 3001 (interna)
            startService('API', 'node', ['apps/api/dist/main.js'], '/app');

            // Web na porta 3000 (externa/pública no Railway)
            startService('WEB', 'node', ['apps/web/server.js'], '/app');
        });
    });
}

main();
