let attendanceData = [];
let html5QrCode;

// scanner
function onScanSuccess(decodedText) {

  // prevent duplicates (NO alert – iOS safe)
  if (attendanceData.some(entry => entry.roll_no === decodedText)) {
    console.warn("Already scanned:", decodedText);
    return;
  }

  let record = {
    roll_no: decodedText,
    date: new Date().toLocaleDateString()
  };

  attendanceData.push(record);

  // add to table
  let tableBody = document.getElementById("attendance-body");
  let row = tableBody.insertRow(0);

  row.insertCell(0).innerText = record.roll_no;
  row.insertCell(1).innerText = record.date;

  // 🔔 beep on success
  const beep = document.getElementById("beep");
  beep.currentTime = 0;
  beep.play();

  // 🛑 REQUIRED for iOS – stop scanner after one scan
  html5QrCode.stop().then(() => {
    html5QrCode.clear();
    html5QrCode = null;
  });
}

// manual entry
function addManualEntry() {
  const input = document.getElementById("manualRoll");
  const rollNo = input.value.trim();

  if (rollNo === "") {
    alert("Please enter Roll Number");
    return;
  }

  if (attendanceData.some(entry => entry.roll_no === rollNo)) {
    alert("Already scanned");
    return;
  }

  let record = {
    roll_no: rollNo,
    date: new Date().toLocaleDateString()
  };

  attendanceData.push(record);

  let tableBody = document.getElementById("attendance-body");
  let row = tableBody.insertRow(0);

  row.insertCell(0).innerText = record.roll_no;
  row.insertCell(1).innerText = record.date;

  input.value = "";
}

// excel download
function downloadExcel() {
  if (attendanceData.length === 0) {
    alert("No data to export.");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(attendanceData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

  const date = new Date().toISOString().split("T")[0];
  XLSX.writeFile(workbook, `CRT_Attendance_${date}.xlsx`);
}

// start scanner
function startScanner() {
  if (html5QrCode) return;

  // 🔓 unlock audio for iOS
  document.getElementById("beep").play().catch(() => {});

  html5QrCode = new Html5Qrcode("reader");

  html5QrCode.start(
    { facingMode: "environment" },
    {
      fps: 10,
      qrbox: { width: 250, height: 100 }
    },
    onScanSuccess,
    () => {}
  ).catch(err => {
    alert("Camera error: " + err);
  });
}

