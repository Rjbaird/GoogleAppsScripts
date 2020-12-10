/*

// =============== Function Overview =============== //


*/

function getStorage() {
    var folder = DriveApp.getFolderById("ENTER FOLDER ID HERE"); // gets the folder by id
    
    var files = folder.getFiles(); // gets the files in the folder
    
    var folderStorage = 0;
    
    while (files.hasNext()) {
        var file = files.next();
        folderStorage = folderStorage + file.getSize();
    }
    
    var storageInGb = (folderStorage / 1073741824).toFixed(2);
    
    return storageInGb;
}