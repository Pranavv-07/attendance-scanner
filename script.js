let attendance = [];

// Called when QR is successfully scanned
function onScanSuccess(decodedText) {

  // OPTIONAL: prevent duplicate scans
  if (attendance.some(entry => entry.id === decodedText)) {
    alert("Already Scanned!");
    return;
  }

  let now = new Date();

  let record = {
    id: decodedText,
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString()
  };

  attendance.push(record);

  // Add to table
  let table = document.getElementById("table");
  let row = table.insertRow();

  row.insertCell(0).innerText = record.id;
  row.insertCell(1).innerText = record.date;
  row.insertCell(2).innerText = record.time;
}

// Start QR Scanner
const html5QrCode = new Html5Qrcode("reader");

html5QrCode.start(
  { facingMode: "environment" },
  {
    fps: 10,
    qrbox: { width: 250, height: 250 }
  },
  onScanSuccess,
  error => {
    // Ignore scan errors
  }
);

// Download Excel
function downloadExcel() {
  if (attendance.length === 0) {
    alert("No attendance data to download!");
    return;
  }

  let worksheet = XLSX.utils.json_to_sheet(attendance);
  let workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
  XLSX.writeFile(workbook, "event_attendance.xlsx");
}
