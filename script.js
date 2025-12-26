let attendanceData = [];

function onScanSuccess(decodedText) {
// DuplicateCheck()
  if (attendanceData.some(entry => entry.roll_no === decodedText)) {
    alert("Already scanned");
    return;
  }

  const now = new Date();
  const record = {
    roll_no: decodedText,
    date: now.toLocaleDateString()   
  };

  attendanceData.push(record);
  addRow(record);
}

/* Manual Entry */
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
  addRow(record);
  input.value = "";
}


function addRow(record) {
  const tableBody = document.getElementById("attendance-body");
  const row = tableBody.insertRow(0);

  row.insertCell(0).innerText = record.roll_no;
  row.insertCell(1).innerText = record.date;
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
