import { app, BrowserWindow } from "electron";

/**
 * Ref: https://www.electronjs.org/docs/tutorial/quick-start#create-the-main-script-file
 */
async function createWindow(): Promise<void> {
  // Creating a browser window
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
  });

  /**
   * Handle bluetooth connection
   * Ref: https://www.electronjs.org/docs/latest/tutorial/devices#web-bluetooth-api
   */
  win.webContents.on("select-bluetooth-device", (event, devices, callback) => {
    event.preventDefault();
    if (devices.length > 0) {
      callback(devices[0].deviceId);
    }
  });

  // Load index.html
  win.maximize();
  await win.loadFile("./dist/renderer/index.html");
}

function setUpElectronApp(): void {
  // Allow the use of navigator.bluetooth.getDevices()
  app.commandLine.appendSwitch("enable-experimental-web-platform-features", "true");

  // Enable webBluetooth
  app.commandLine.appendSwitch("enable-web-bluetooth", "true");

  // Create bowser window once the electron app is initialized
  app
    .whenReady()
    .then(() => {
      createWindow();
    })
    .catch((err) => {
      throw err as Error;
    });

  // Quit the application when it no longer has any open windows
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      // The action is no-op on macOS due to the OS' behavior (https://support.apple.com/en-ca/guide/mac-help/mchlp2469/mac)
      // On macOS it is common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q
      app.quit();
    }
  });

  // Create a new browser window only when the application has no visible windows being activated
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      // On macOS it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
      createWindow();
    }
  });
}

setUpElectronApp();
