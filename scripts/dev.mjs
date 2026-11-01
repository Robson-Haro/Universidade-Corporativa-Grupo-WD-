import { spawn } from 'node:child_process';
const args = process.argv.slice(2).filter(arg => arg !== '--strictPort').map(arg => arg === '--host' ? '--hostname' : arg);
const mode = process.argv.includes('--strictPort') ? 'start' : 'dev';
const child = spawn(process.execPath, ['node_modules/next/dist/bin/next',mode,...args], {stdio:'inherit'});
for (const signal of ['SIGINT','SIGTERM']) process.on(signal,()=>child.kill(signal));
child.on('exit',code=>process.exit(code ?? 1));
