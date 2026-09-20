// Vixel Admin: a window on https://vixelagency.com/admin/. The portal stays a
// web app; this only gives it a Dock/taskbar icon, its own cookie jar and a
// native window. Anything off-site opens in the default browser.
const { app, BrowserWindow, shell, Menu } = require("electron");

const ADMIN_URL = "https://vixelagency.com/admin/";
const ALLOWED_HOSTS = new Set(["vixelagency.com", "www.vixelagency.com"]);

function isPortal(url) {
  try { return ALLOWED_HOSTS.has(new URL(url).hostname); } catch { return false; }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280, height: 860, minWidth: 900, minHeight: 600,
    title: "Vixel Admin",
    backgroundColor: "#faf9f6",
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  win.loadURL(ADMIN_URL);
  // Keep the window on the portal; everything else goes to the system browser.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!isPortal(url)) shell.openExternal(url);
    return { action: "deny" };
  });
  win.webContents.on("will-navigate", (event, url) => {
    if (!isPortal(url)) { event.preventDefault(); shell.openExternal(url); }
  });
  win.webContents.on("did-fail-load", (_e, code, desc) => {
    if (code === -3) return; // aborted by a newer navigation
    win.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(
      `<body style="font-family:-apple-system,Segoe UI,sans-serif;background:#faf9f6;color:#12151a;display:grid;place-items:center;height:100vh;margin:0">
       <div style="text-align:center"><h2>Can't reach vixelagency.com</h2><p style="color:#666">${desc || code}</p>
       <button onclick="location.href='${ADMIN_URL}'" style="background:#f2c230;border:0;padding:10px 18px;border-radius:6px;font-weight:600;cursor:pointer">Retry</button></div></body>`));
  });
  return win;
}

app.setName("Vixel Admin");
app.whenReady().then(() => {
  const isMac = process.platform === "darwin";
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    ...(isMac ? [{ role: "appMenu" }] : []),
    { label: "Edit", submenu: [{ role: "undo" }, { role: "redo" }, { type: "separator" }, { role: "cut" }, { role: "copy" }, { role: "paste" }, { role: "selectAll" }] },
    { label: "View", submenu: [{ label: "Home", accelerator: "CmdOrCtrl+Shift+H", click: () => BrowserWindow.getFocusedWindow()?.loadURL(ADMIN_URL) }, { role: "reload" }, { type: "separator" }, { role: "resetZoom" }, { role: "zoomIn" }, { role: "zoomOut" }, { type: "separator" }, { role: "togglefullscreen" }] },
    { role: "windowMenu" },
  ]));
  createWindow();
  app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
