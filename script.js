let attendanceData = [];
let html5QrCode;

// scanner
function onScanSuccess(decodedText) {

  // Prevent duplicate scans
  if (attendanceData.some(entry => entry.roll_no === decodedText)) {
    alert("Already scanned");
    return;
  }

  let record = {
    roll_no: decodedText,
    date: new Date().toLocaleDateString()
  };

  attendanceData.push(record);

  // Add data to table
  let tableBody = document.getElementById("attendance-body");
  let row = tableBody.insertRow(0);

  row.insertCell(0).innerText = record.roll_no;
  row.insertCell(1).innerText = record.date;
}

// addManualEntry()
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

// download_excel()
function downloadExcel() {
  if (attendanceData.length === 0) {
    alert("No data to export.");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(attendanceData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

  const date = new Date().toISOString().split("T")[0];
  XLSX.writeFile(workbook, `CRT_Attendance_${date}.xlsx`); // saves file with dat
}


function startScanner() {
  if (html5QrCode) return; 

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
