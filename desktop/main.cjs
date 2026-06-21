const { app, BrowserWindow, dialog, shell } = require("electron");
const { spawn } = require("node:child_process");
const http = require("node:http");
const net = require("node:net");
const path = require("node:path");

let mainWindow;
let nextProcess;

const appRoot = path.join(__dirname, "..");

async function findFreePort(startPort = 4510) {
  for (let port = startPort; port < startPort + 100; port += 1) {
    const available = await new Promise((resolve) => {
      const server = net.createServer();
      server.once("error", () => resolve(false));
      server.once("listening", () => {
        server.close(() => resolve(true));
      });
      server.listen(port, "127.0.0.1");
    });

    if (available) {
      return port;
    }
  }

  throw new Error("No local port is available for PinPilot.");
}

function waitForServer(url, timeoutMs = 30000) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    function check() {
      const request = http.get(url, (response) => {
        response.resume();
        resolve();
      });

      request.on("error", () => {
        if (Date.now() - startedAt > timeoutMs) {
          reject(new Error("PinPilot local server did not start in time."));
          return;
        }

        setTimeout(check, 500);
      });
    }

    check();
  });
}

function serverEnv(port) {
  const env = { ...process.env, PORT: String(port) };

  if (process.platform === "win32") {
    const pathValue = env.Path || env.PATH || env.path;
    delete env.PATH;
    delete env.Path;
    delete env.path;
    env.Path = pathValue;
  }

  return env;
}

function npmCommand() {
  return process.platform === "win32" ? "npm" : "npm";
}

async function startNextServer(port) {
  nextProcess = spawn(npmCommand(), ["run", "start", "--", "-p", String(port), "-H", "127.0.0.1"], {
    cwd: appRoot,
    env: serverEnv(port),
    shell: process.platform === "win32",
    stdio: "pipe"
  });

  nextProcess.stdout.on("data", (data) => {
    console.log(`[pinpilot] ${data}`);
  });

  nextProcess.stderr.on("data", (data) => {
    console.error(`[pinpilot] ${data}`);
  });

  nextProcess.on("exit", (code) => {
    if (code && mainWindow) {
      mainWindow.webContents.executeJavaScript(
        `document.body.innerHTML = '<main style="font-family:Arial;padding:32px"><h1>PinPilot stopped</h1><p>The local app server exited with code ${code}.</p></main>'`
      ).catch(() => {});
    }
  });

  await waitForServer(`http://127.0.0.1:${port}/dashboard`);
}

function createWindow(port) {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1060,
    minHeight: 700,
    title: "PinPilot",
    backgroundColor: "#f7f7f5",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.loadURL(`http://127.0.0.1:${port}/dashboard`);
}

app.whenReady()
  .then(async () => {
    const port = await findFreePort();
    await startNextServer(port);
    createWindow(port);
  })
  .catch((error) => {
    dialog.showErrorBox(
      "PinPilot could not start",
      `${error instanceof Error ? error.message : String(error)}\n\nRun npm run desktop:build again after closing old PinPilot/Node windows.`
    );
    app.quit();
  });

app.on("window-all-closed", () => {
  if (nextProcess) {
    nextProcess.kill();
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  if (nextProcess) {
    nextProcess.kill();
  }
});
