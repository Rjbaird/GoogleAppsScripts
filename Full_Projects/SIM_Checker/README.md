# SIM Card Checker
![JavaScript](https://img.shields.io/badge/-JavaScript-000000?style=for-the-badge&logo=javascript)
![google](https://img.shields.io/badge/-google_app_scripts-000000?style=for-the-badge&logo=google)

Currently, we need to manually cross reference our on-hand SIM card numbers with our inventory system.

This script compares two sets of data in Google Sheets to find missing SIM cards. One set will be scanned in manually (aka our on-hand actual inventory) and another will be uploaded from the store's inventory list. The script will search for each on-hand SIM card number in the inventory. Any SIM cards not matched up will be considered missing inventory.

## Functions
onOpen()
- Creates a "Custom Functions" menu for the Spreadsheet. Functions can be run by selecting them from the menu.

clearData(range)
- Clears old data from the spreadsheet for a given range

checkForMissingSIM()
- Main function for the script.

makeTwoDArray(arr)
- Creates a 2D array from a 1D array for pasting into the Spreadsheet columns

## Screenshots
![App Screenshot](screenshot.png?raw=true)

