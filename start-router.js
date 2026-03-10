const { spawn } = require('child_process');

const service = process.env.SERVICE_NAME;

if (service === 'api') {
    console.log('Starting API service...');
    // No monorepo, o prisma generate deve ser rodado no build. 
    // O db push e seed rodam no start da API.
    const child = spawn('sh', ['-c', 'npx prisma db push && npx prisma db seed && node apps/api/dist/main.js'], {
        stdio: 'inherit',
        cwd: '/app'
    });
    child.on('exit', (code) => process.exit(code || 0));
} else if (service === 'web') {
    console.log('Starting Web service...');
    // No Next.js standalone, o server.js fica na raiz da pasta standalone que copiamos
    const child = spawn('node', ['apps/web/server.js'], {
        stdio: 'inherit',
        cwd: '/app'
    });
    child.on('exit', (code) => process.exit(code || 0));
} else {
    console.log('SERVICE_NAME must be "api" or "web". Current:', service);
    process.exit(1);
}
