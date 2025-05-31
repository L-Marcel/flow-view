import "dotenv/config";
import ngrok from "@ngrok/ngrok";
import { spawn } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

(async function () {
  ngrok.kill();
  
  const backendFolderPath = path.resolve(__dirname, "backend");
  const frontendFolderPath = path.resolve(__dirname, "frontend");
  const n8nFolderPath = path.resolve(__dirname);

  const backendLogFile = fs.openSync(path.resolve(__dirname, 'backend.log'), 'w');
  const frontendLogFile = fs.openSync(path.resolve(__dirname, 'frontend.log'), 'w');
  const n8nLogFile = fs.openSync(path.resolve(__dirname, 'n8n.log'), 'w');

  const backendListener = await ngrok.forward({
    addr: 8080,
    authtoken_from_env: true,
  });

  const frontendListener = await ngrok.forward({
    addr: 5173,
    authtoken_from_env: true,
  });

  const n8nListener = await ngrok.forward({
    addr: 5678,
    authtoken_from_env: true,
  });

  console.log(`Backend: ${backendListener.url()}`);
  console.log(`Frontend: ${frontendListener.url()}`);
  console.log(`N8N: ${n8nListener.url()}`);

  const backend = spawn("mvn", ["spring-boot:run"], {
    stdio: ["inherit", backendLogFile, backendLogFile],
    shell: true,
    cwd: backendFolderPath,
    env: process.env,
  });
  
  const frontend = spawn("pnpm", ["vite"], {
    stdio: ["inherit", frontendLogFile, frontendLogFile],
    shell: true,
    cwd: frontendFolderPath,
    env: {
      ...process.env,
      VITE_BACKEND_URL: backendListener.url() as string
    },
  });

  const n8n = spawn("pnpm", ["n8n", "start"], {
    stdio: ["inherit", n8nLogFile, n8nLogFile],
    shell: true,
    env: {
      ...process.env,
      WEBHOOK_URL: n8nListener.url() as string,
      N8N_HOST: (n8nListener.url() as string).replace(/https?:\/\//, ""),
      N8N_USER_FOLDER: n8nFolderPath,
      N8N_CONFIG_FILE: "",
      BACKEND_URL: backendListener.url() as string
    }
  });

  const killAll = () => {
    if(n8n && !n8n.killed) n8n.kill();
    if(frontend && !frontend.killed) frontend.kill();
    if(backend && !backend.killed) backend.kill();

    setTimeout(() => {
      fs.closeSync(backendLogFile);
      fs.closeSync(frontendLogFile);
      fs.closeSync(n8nLogFile);
      process.exit(0);
    }, 500);
  };

  backend.on("exit", () => {
    console.log(`Backend encerrado!`);
    killAll();
  });
  
  frontend.on("exit", () => {
    console.log(`Frontend encerrado!`);
    killAll();
  });

  n8n.on("exit", () => {
    console.log(`N8N encerrado!`);
    killAll();
  });

  process.on('SIGINT', () => {
    console.log('\nEncerrando subprocessos...');
    killAll();
  });
})();

process.stdin.resume();
