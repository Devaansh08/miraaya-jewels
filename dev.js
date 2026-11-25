/**
 * Miraaya Jewels - Fullstack Development Runner
 * 
 * Auto-detects and frees occupied ports (5000 & 3000), starts both backend
 * and frontend in one go, handles Windows process tree shutdowns cleanly,
 * and eliminates EADDRINUSE errors forever.
 */

const { spawn, execSync } = require('child_process');
const path = require('path');

const root = __dirname;
const runningProcesses = [];
let shuttingDown = false;

// 1. Forcefully free a port if occupied by any stale process
function freePort(port) {
  const isWin = process.platform === 'win32';
  try {
    if (isWin) {
      const stdout = execSync(`netstat -ano -p tcp | findstr :${port}`, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore']
      });
      const lines = stdout.trim().split(/\r?\n/);
      const pids = new Set();
      for (const line of lines) {
        if (line.includes('LISTENING') || line.includes(`:${port}`)) {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          if (pid && pid !== '0' && pid !== String(process.pid)) {
            pids.add(pid);
          }
        }
      }
      for (const pid of pids) {
        try {
          console.log(`\x1b[33m[Port Guard]\x1b[0m Clearing stale process (PID ${pid}) on port ${port}...`);
          execSync(`taskkill /F /T /PID ${pid}`, { stdio: 'ignore' });
        } catch (_) {}
      }
    } else {
      try {
        execSync(`lsof -ti tcp:${port} | xargs kill -9`, { stdio: 'ignore' });
      } catch (_) {}
    }
  } catch (_) {
    // Port was already free (findstr returned non-zero exit)
  }
}

// 2. Kill a child process and its entire sub-tree (prevents ghost Vite/Node processes on Windows)
function killTree(child) {
  if (!child || !child.pid) return;
  try {
    if (process.platform === 'win32') {
      execSync(`taskkill /F /T /PID ${child.pid}`, { stdio: 'ignore' });
    } else {
      child.kill('SIGTERM');
    }
  } catch (_) {}
}

function stopAll() {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log('\n\x1b[33m[Miraaya Jewels]\x1b[0m Stopping servers...');
  for (const child of runningProcesses) {
    killTree(child);
  }
  runningProcesses.length = 0;
  // Final cleanup of ports
  freePort(5000);
  freePort(3000);
  process.exit(0);
}

// 3. Spawn a service with formatted console output
function startService(name, color, command, args, cwd) {
  // Use shell: false so paths with spaces (e.g. "Miraaya Jewell") are not split by cmd.exe
  const child = spawn(command, args, {
    cwd,
    stdio: 'inherit',
    shell: false
  });

  runningProcesses.push(child);

  child.on('error', (err) => {
    console.error(`\x1b[31m[${name} Error]\x1b[0m ${err.message}`);
    stopAll();
  });

  child.on('exit', (code) => {
    if (!shuttingDown && code !== 0) {
      console.error(`\x1b[31m[${name}]\x1b[0m Exited with code ${code}`);
      stopAll();
    }
  });

  return child;
}

// 4. Main startup flow
async function main() {
  console.log('\n\x1b[36m========================================================\x1b[0m');
  console.log('\x1b[1m\x1b[33m      👑  MIRAAYA JEWELS — LUXURY E-COMMERCE  👑      \x1b[0m');
  console.log('\x1b[36m========================================================\x1b[0m\n');

  console.log('\x1b[90m[Port Guard] Verifying ports 5000 and 3000 are clear...\x1b[0m');
  freePort(5000);
  freePort(3000);

  // Short pause to ensure OS socket release
  await new Promise((resolve) => setTimeout(resolve, 300));

  console.log('\x1b[32m✔ Ports free. Launching full-stack environment...\x1b[0m\n');

  // Start Backend on 5000
  startService(
    'BACKEND',
    '\x1b[33m',
    process.execPath,
    ['server.js'],
    path.join(root, 'backend')
  );

  // Start Frontend on 3000
  const viteBin = path.join(root, 'frontend', 'node_modules', 'vite', 'bin', 'vite.js');
  startService(
    'FRONTEND',
    '\x1b[36m',
    process.execPath,
    [viteBin, '--port', '3000', '--strictPort', '--host'],
    path.join(root, 'frontend')
  );

  console.log('\x1b[35m--------------------------------------------------------\x1b[0m');
  console.log('  🌐 \x1b[1mFrontend:\x1b[0m  \x1b[36mhttp://localhost:3000\x1b[0m');
  console.log('  ⚙️  \x1b[1mBackend:\x1b[0m   \x1b[33mhttp://localhost:5000\x1b[0m');
  console.log('  🏥 \x1b[1mHealth:\x1b[0m    \x1b[32mhttp://localhost:5000/api/health\x1b[0m');
  console.log('\x1b[35m--------------------------------------------------------\x1b[0m\n');
}

// Handle terminal termination events
process.on('SIGINT', stopAll);
process.on('SIGTERM', stopAll);
process.on('SIGHUP', stopAll);

if (require.main === module) {
  main().catch((err) => {
    console.error('\x1b[31mFatal Startup Error:\x1b[0m', err);
    stopAll();
  });
}

module.exports = { freePort, stopAll };
