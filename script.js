let attendanceData = [];

// Function triggered on successful scan
function onScanSuccess(decodedText) {
  // Check for duplicates
  if (attendanceData.some(entry => entry.id === decodedText)) {
    return; 
  }

  const now = new Date();
  const record = {
    id: decodedText,
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString()
  };

  // Add to data array
  attendanceData.push(record);

  // Update UI Table (Newest scan at the top)
  const tableBody = document.getElementById("attendance-body");
  const row = tableBody.insertRow(0);

  const cellId = row.insertCell(0);
  const cellDate = row.insertCell(1);
  const cellTime = row.insertCell(2);

  cellId.innerText = record.id;
  cellId.className = "scanned-id"; // Applies the brand green color
  cellDate.innerText = record.date;
  cellTime.innerText = record.time;
}

// Initialize the QR Scanner
const html5QrCode = new Html5Qrcode("reader");
const config = { 
  fps: 10, 
  qrbox: { width: 250, height: 250 } 
};

html5QrCode.start(
  { facingMode: "environment" }, 
  config, 
  onScanSuccess,
  (error) => { /* Errors ignored for cleaner performance */ }
);

// Function to export table to Excel
function downloadExcel() {
  if (attendanceData.length === 0) {
    alert("No data to export.");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(attendanceData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
  
  // File name using brand name
  XLSX.writeFile(workbook, "CRT_Attendance_Report.xlsx");
}
