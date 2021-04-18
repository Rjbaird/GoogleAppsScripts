/*

// =============== Script Overview =============== //
This script is designed to work with a Deposit Spreadsheet that can be used to count tills at a business End of Day
- The user will fill out the information in the spreadsheet to get the total Deposit amount. 
- Once the tills and deposit are done, the user can click a button to run a script that will make a PDF of the till balance and final deposit count.
- The PDF is saved to Google Drive and also emailed to the manager for review.

// =============== Problem being solved =============== //
Businesses need a way to ensure that their tills are both counted correctly and/or are not being skimmed. 
- This script also helps the employees quickly get through the End of Day task of counting tills while also giving the manager 
the piece of mind that employees are doing the task correctly.


// =============== Algorithms & Steps =============== //
1. Open the Deposit sheet
2. Create folder for PDFs and copy of sheet
3. Get all data in the spreadsheet 
4. Export as a PDF
5. Create email for management
6. Send email with PDF attached
7. Display modal showing the task was completed

// =============== Functions =============== //
createPdfName() & createFolderName()
- Get the date to create the name of the PDFs and folder for the EoD PDFs

createPdf()
- Create a PDF file out of a sheet in a Spreadsheet

sendEmail()
- Creates and sends an email with a preset Recipient, Subject, Body, and attachements from a Google Drive Folder

showAlert()
- Displays an alert to the user so they know the script ran correctly

timeTrigger()
- Used to email the manager if no deposit was filled out. Runs after a specific time.

// =============== TODOs =============== //

DONE: Make createPdfName function
DONE: Make createPdf function
DONE: Make sendEmail function
DONE: Create button in spreadsheet to trigger function
DONE: Create modal to alert the user the files were created
DONE: Create README file
DONE: Upload to Github and portfolio

*/

// =============== Global Variables =============== //

var sheetID = "sheetID" // Google Sheed used to generate the PDF data
var folderId = "folderID" // folder for where to save the PDFs
var pdfBody = "Bairrya Tech" // entered before the date in the PDF file name
var emailBody = "End of Day Complete! Here are the deposit files!" // this text is entered as the body of the EoD email
var managers = ["email1", "email2"] // email addresses to recieve a copy of the PDFs

function showAlert() {
  var ui = SpreadsheetApp.getUi();
  var result = ui.alert(
    'Please confirm End of Day was completed',
    'Are you sure you want to continue?',
    ui.ButtonSet.YES_NO);
  if (result == ui.Button.YES) { // Process the user's response. If the user clicked "Yes".
    sendEmail();
    ui.alert('End of Day complete!');
  } else { // User clicked "No" or X in the title bar.
    ui.alert('Confirmation cancelled. Press "Submit Deposit" again to complete End of Day');
  }
}

function completeEndOfDay() {
  /*
  This function runs when the End of Day button is clicked.
  */
  showAlert();
}

function sendEmail() {
  var pdf = DriveApp.getFileById(createPdf())
  GmailApp.sendEmail(managers, "PDF Test", emailBody, {
    attachments: [pdf.getAs(MimeType.PDF)],
    name: 'Automatic Emailer Script'
  });
}

function createPdf() {
  /*
 This function creates a PDF based on the data in the Deposit Spreadsheet
  */
  var folderName = ""
  var pdfName = createPdfName(pdfBody);
  var url = "https://www.googleapis.com/drive/v3/files/" + sheetID + "/export?mimeType=application/pdf";
  var options = {
    method: "GET",
    headers: { Authorization: "Bearer " + ScriptApp.getOAuthToken() },
    muteHttpExceptions: true
  };
  var response = UrlFetchApp.fetch(url, options).getBlob();
  var newPdf = DriveApp.getFolderById(folderId).createFile(response).setName(pdfName);
  return newPdf.getId()
}

function createPdfName(body) {
  /*
  Create a file name for the PFD that contains the day, month, and year the deposit was created
  */
  var today = new Date(); // get all current time information
  var year = today.getFullYear();
  var month = today.getMonth() + 1;
  var day = today.getDate();
  var fileName = body + " Deposit: " + day + "_" + month + "_" + year;
  return fileName;
}

function createFolderName() {
  /*
  Create a folder name that contains the day, month, and year the deposit was created
  */
  var today = new Date(); // get all current time information
  var year = today.getFullYear();
  var month = today.getMonth() + 1;
  var day = today.getDate();
  var folderName = "EoD Files: " + day + "_" + month + "_" + year;
  return folderName;
}
