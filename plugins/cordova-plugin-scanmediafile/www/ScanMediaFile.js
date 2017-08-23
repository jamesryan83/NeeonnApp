module.exports = {
    scan: function (fileUri, successCallback, errorCallback) {
		console.log("hi 1");
        console.log(fileUri);
        cordova.exec(successCallback, errorCallback, "ScanMediaFile", "scan", [fileUri]);
    }
};
