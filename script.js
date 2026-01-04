let html5QrCode;
let isScanning = false;
let beepUnlocked = false;

function unlockBeep() {
  const beep = document.getElementById("beep");
  beep.play().then(() => {
    beep.pause();
    beep.currentTime = 0;
    beepUnlocked = true;
  }).catch(() => {
    // iOS will block until user gesture – this is expected
  });
}

function startScanner() {
  if (html5QrCode) return;

  unlockBeep(); // 🔓 unlock audio on user click

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

  // 🔔 play beep (works on iOS)
  if (beepUnlocked) {
    const beep = document.getElementById("beep");
    beep.currentTime = 0;
    beep.play();
  }

  // 🔴 CRITICAL iOS FIX
  html5QrCode.stop().then(() => {
    html5QrCode.clear();
    html5QrCode = null;
  }).catch(err => {
    console.error("Stop failed:", err);
  });
}

function onScanError(errorMessage) {
  console.warn("Scan error:", errorMessage);
}

function restartScanner() {
  isScanning = false;
  document.getElementById("result").innerText = "Scan a QR code";
  startScanner();
}
