const xlsx = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '..', 'Task Tracker Pro - V3.0 [Share].xlsx');
console.log('Reading file:', filePath);

try {
  const workbook = xlsx.readFile(filePath);
  const sheetNames = workbook.SheetNames;
  
  console.log('\n--- Sheets Found ---');
  console.log(sheetNames.join(', '));
  
  sheetNames.forEach(sheetName => {
    console.log(`\n--- Structure of Sheet: ${sheetName} ---`);
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    
    // Find the first few non-empty rows to show headers and sample data
    let rowCount = 0;
    for (let i = 0; i < Math.min(20, data.length); i++) {
      if (data[i] && data[i].length > 0) {
        console.log(`Row ${i + 1}:`, data[i]);
        rowCount++;
        if (rowCount >= 5) break; // show up to 5 rows
      }
    }
  });
} catch (e) {
  console.error('Error reading file:', e);
}
