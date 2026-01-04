let html5QrCode;
let isScanning = false;

function startScanner() {
  if (html5QrCode) return;

  html5QrCode = new Html5Qrcode("reader");

  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: { width: 250, height: 250 } },
    onScanSuccess,
    onScanError
  ).catch(err => {
    console.error("Camera start error:", err);
  });
}

function onScanSuccess(decodedText) {
  if (isScanning) return;
  isScanning = true;

  document.getElementById("result").innerText =
    "Scanned: " + decodedText;

  // 🔴 CRITICAL iOS FIX
  html5QrCode.stop().then(() => {
    html5QrCode.clear();
    html5QrCode = null;
  }).catch(err => {
    console.error("Stop failed:", err);
  });
}

function onScanError(errorMessage) {
  // ❌ DO NOT use alert() on iOS
  console.warn("Scan error:", errorMessage);
}

function restartScanner() {
  isScanning = false;
  document.getElementById("result").innerText = "Scan a QR code";
  startScanner();
}
