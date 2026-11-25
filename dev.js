const { spawn } = require('child_process');
const path = require('path');

console.log('\x1b[33m%s\x1b[0m', '═════════════════════════════════════════════════');
console.log('\x1b[36m%s\x1b[0m', '  👑 MIRAAYA JEWELS — FULLSTACK DEV SERVER');
console.log('\x1b[32m%s\x1b[0m', '  🚀 Backend API:  http://localhost:5000');
console.log('\x1b[32m%s\x1b[0m', '  💎 Frontend App: http://localhost:3000');
console.log('\x1b[33m%s\x1b[0m', '═════════════════════════════════════════════════\n');

// Start backend
const backend = spawn('npm', ['run', 'start', '--prefix', 'backend'], {
  stdio: 'inherit',
  shell: true
});

// Start frontend
const frontend = spawn('npm', ['run', 'dev', '--prefix', 'frontend'], {
  stdio: 'inherit',
  shell: true
});

function cleanup() {
  console.log('\nGracefully shutting down Miraaya Jewels servers...');
  try { backend.kill(); } catch (e) {}
  try { frontend.kill(); } catch (e) {}
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
