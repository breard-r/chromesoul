//
// Renato Mangini
// http://updates.html5rocks.com/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
// http://stackoverflow.com/questions/6965107/converting-between-strings-and-arraybuffers
//
// Edited by Rodolphe Breard
//  - Using Uint8Array instead of Uint16Array
//

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function str2ab(str) {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
