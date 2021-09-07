var ss = SpreadsheetApp.getActive(); // access the current spreadsheet
var sheet = ss.getSheetByName('Main'); // access the Main sheet in the spreadsheet
var lastRow = sheet.getLastRow(); // get the number for the last row
var lastCol = sheet.getLastColumn(); // get the number for the last column
var allCells = sheet.getRange(1, 1, lastRow, lastCol); // set a range for the whole sheet
var scannedSIMsRange = sheet.getRange(4, 2, lastRow, 1).getValues(); // get an array of values from the Scanned SIMs column
var scannedData = scannedSIMsRange.map(function (r) { return r[0]; }).filter(item => item); // get an array of the arrays made from Scanned SIMs column
var inventorySIMsRange = sheet.getRange(4, 3, lastRow, 1).getValues(); // get an array of values from the Inventory SIMs column
var inventoryData = inventorySIMsRange.map(function (r) { return r[0]; }).filter(item => item); // get an array of the arrays made from Inventory SIMs column

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('Custom Functions')
    .addItem('Verify SIMs', 'checkForMissingSIM')
    .addItem('Clear Data', 'clearAllData')
    .addToUi();
}

function checkForMissingSIM() {
  var missingSIMS = [];
  var updatedInventoryData = [];
  // For each SIM card in inventory
  for (i = 0; i < inventoryData.length; i++) {
    var simCardNum = inventoryData[i];
    if (scannedData.includes(simCardNum)) {
      // If the SIM card is found in scanned SIMs
      // Remove the SIM card from the scanned SIMs array
      var foundSIM = scannedData.indexOf(simCardNum);
      scannedData.splice(foundSIM, 1);
    } else {
      // Otherwise if the SIM card is not in the scanned SIMs
      // Add ICCID to missingSIMS array
      missingSIMS.push([simCardNum]);
    }
  }

  if (scannedData.length > 0) {
  var extraSIMs = makeTwoDArray(scannedData);
  var extraSIMsRange = sheet.getRange(4, 6, extraSIMs.length, 1);
  extraSIMsRange.setValues(extraSIMs);
  }

  var missingSIMsRange = sheet.getRange(4, 5, missingSIMS.length, 1);
  missingSIMsRange.setValues(missingSIMS);
}

function makeTwoDArray(arr) {
  var twoDArray = [];
  for (i = 0; i < arr.length; i++) {
    var value = arr[i];
    twoDArray.push([value])
  }
  return twoDArray
}

function clearData(range) {
  range.clearContent();
}

function clearAllData() {
  // Clear Scanned SIMs Range
  clearData(sheet.getRange(4, 2, lastRow, 1));
  // Clear Inventory SIMs Range
  clearData(sheet.getRange(4, 3, lastRow, 1));
  // Clear Missing SIMs Range
  clearData(sheet.getRange(4, 5, lastRow, 1));
  // Clear Extra SIMs Range
  clearData(sheet.getRange(4, 6, lastRow, 1));
}