let attendanceData = [];

function onScanSuccess(decodedText) {
  // checkDuplicate()
  if (attendanceData.some(entry => entry.roll_no === decodedText)) {
    alert("Already scanned");
    return;
  }

  const now = new Date();
  const record = {
    roll_no: decodedText,
    date: now.toLocaleDateString() 
  };


  attendanceData.push(record); //pushing intonthe array

  // Add to table
  const tableBody = document.getElementById("attendance-body");
  const row = tableBody.insertRow(0);

  const cellId = row.insertCell(0);
  const cellDate = row.insertCell(1);

  cellId.innerText = record.roll_no;
  cellId.className = "scanned-id";
  cellDate.innerText = record.date;
}

// Scanner
const html5QrCode = new Html5Qrcode("reader");
const config = {
  fps: 10,
  qrbox: { width: 250, height: 100 }
};

html5QrCode.start(
  { facingMode: "environment" },
  config,
  onScanSuccess,
  () => {}
);

// Manualentry()
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

  const now = new Date();
  const record = {
    roll_no: rollNo,
    date: now.toLocaleDateString() 
  };

  attendanceData.push(record);

  const tableBody = document.getElementById("attendance-body");
  const row = tableBody.insertRow(0);

  row.insertCell(0).innerText = record.roll_no;
  row.insertCell(1).innerText = record.date;

  input.value = "";
}

// DownloadExcel()
function downloadExcel() {
  if (attendanceData.length === 0) {
    alert("No data to export.");
    return;
  }

  const date = new Date().toISOString().split("T")[0];
  const fileName = `CRT_Attendance_${date}.xlsx`;

  const worksheet = XLSX.utils.json_to_sheet(attendanceData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

  XLSX.writeFile(workbook, fileName);
}
