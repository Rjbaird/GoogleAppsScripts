# Deposit PDF Generator
This script is designed to work with a Google Sheets Spreadsheet that can be used to count tills at a business End of Day
- The user will fill out the information in the spreadsheet to get the total Deposit amount. 
- Once the tills and deposit are done, the user can click a button to run a script that will make a PDF of the till balance and final deposit count.
- The PDF is saved to Google Drive and also emailed to the manager(s) for review.

## Motivation
Businesses need a way to ensure that their tills are both counted correctly to prevent shrink. 
- This script also helps the employees quickly get through the End of Day task of counting tills while also giving the manager the piece of mind that employees are doing the task correctly.

## Tech & Frameworks Used
GSuite applications and APIs:
- Google Drive API
- Google Sheets
- Gmail

<b>Code built with</b>
- [Google Apps Scripts](https://developers.google.com/apps-script)

## Features
Once an employee is done counting the tills, cash on hand, and deposit, they simply press the "Submit" button the to generate the PDFs and send the email.

The script is designed to be customizable file names and email recipients

## Credits
The following information about the Google Drive API was found on [Stackoverflow](https://stackoverflow.com/questions/43504537/google-app-script-save-spreadsheet-to-pdf-saved-on-google-drive)

Using Drive API, you can convert a spreadsheet to a PDF with each sheet as a page. In order to use this, enable Drive API on Google API Console as follows:

1. Go to your Google Cloud Console 
2. In the Navigation Menu in the top left corner, click on APIs & Services
3. Click the + ENABLE APIS AND SERVICES link
4. Scroll down and select the Google Drive API card
5. Click ENABLE
