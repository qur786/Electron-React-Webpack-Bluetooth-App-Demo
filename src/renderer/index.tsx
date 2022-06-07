import { useState } from "react";
import { createRoot } from "react-dom/client";

function BluetoothApp () {
  const [device, setDevice] = useState('');
  async function onClickHandler() {
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true
    });
    setDevice(device.name || device.id || "");
  }
  return (
    <div>
      <h1>Web Bluetooth API</h1>
      <button onClick={onClickHandler}>Test Bluetooth</button>
      <p>Currently selected bluetooth device: <strong>{device}</strong></p>
    </div>
  );
}

const container = document.getElementById("root");
if (container !== null) {
const root = createRoot(container);
root.render(<BluetoothApp />);
}