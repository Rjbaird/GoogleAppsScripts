/*
// =============== Function Overview =============== //
This function allows you to create a PDF based on a Google Doc. 
You'll need one doc as a template with placeholder text and a folder to save the PDFs
I often use this function when creating order forms with data from a Google Form or an API call

*/

function createPDF(data) {
    // folder id for where to save the PDF files
    const pdfFolder = DriveApp.getFolderById("ENTER FOLDER ID HERE");
    // file id for the template document
    const templateDoc = DriveApp.getFileById("ENTER FILE ID HERE");
    // folder where the template doc is located
    const tempFolder = DriveApp.getFolderById("ENTER FOLDER ID HERE");
    // create a copy of the template file in the temp folder
    const newTempFile = templateDoc.makeCopy(tempFolder);
    // open the temp file
    const openDoc = DocumentApp.openById(newTempFile.getId());
    // get the contents of the document
    const body = openDoc.getBody();
    // the first parameter is the text you want to replace from the document
    // the second parameter is the new text
    body.replaceText("{oldText}", data["New Text"][0]);
    // save and close the document
    openDoc.saveAndClose();
    // save the temp document as a PDF
    const blobPDF = newTempFile.getAs(MimeType.PDF);
    // save the document to the PDF folder with whatever name you want
    const pdfFile = pdfFolder.createFile(blobPDF).setName("ENTER FILE NAME HERE");
    // delete the temp document
    tempFolder.removeFile(newTempFile);
}