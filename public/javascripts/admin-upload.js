function fileSelected() {
	var file = document.getElementById('fileToUpload').files[0];
	document.getElementById('adm-upload-btn')
	if (file) {
		var fileSize = 0;
		file.url = window.URL.createObjectURL(file);
		if (file.size > 1024 * 1024)
			fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
		else
			fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
		document.getElementById('fileSize').innerHTML = 'Size: ' + fileSize;
		document.getElementById('adm-upload-btn').style.cssText = "display:inline-block";
		document.getElementById('prebox').innerHTML = '<img src="'+file.url+'" class="prebox"/>';
		document.getElementById('progress').style.cssText = 'width:0%';
		document.getElementById('progressbox').style.cssText = 'display:none';
	}
}
function uploadFile() {
	document.getElementById('progressbox').style.cssText = 'width:200px;display:block;';
	document.getElementById('adm-upload-btn').style.cssText = 'display:none';
	var fd = new FormData();
	fd.append("fileToUpload", document.getElementById('fileToUpload').files[0]);
	var xhr = new XMLHttpRequest();
	xhr.upload.addEventListener("progress", uploadProgress, false);
	xhr.addEventListener("load", uploadComplete, false);
	xhr.addEventListener("error", uploadFailed, false);
	xhr.addEventListener("abort", uploadCanceled, false);
	xhr.open("POST", "/admin/upload/ajax");
	xhr.send(fd);
}
function uploadProgress(evt) {
	if (evt.lengthComputable) {
		var percentComplete = Math.round(evt.loaded * 100 / evt.total);
		document.getElementById('progress').setAttribute('valuenow',percentComplete);
		document.getElementById('progress').style.cssText = 'width:'+percentComplete+'%;';
		document.getElementById('progress').innerHTML = '<span class="">'+percentComplete+'%</span>';
	}
	else {
		document.getElementById('progress').innerHTML = 'unable to compute';
	}
}
function uploadComplete(evt) {
	document.getElementById("progress").innerHTML = JSON.parse(evt.target.responseText).msg;
	document.getElementById('adm-img-containner').innerHTML += '<div class="adm-img-box"><img src="' + JSON.parse(evt.target.responseText).path +'"></div>';
}
function uploadFailed(evt) {
	console.log("There was an error attempting to upload the file.");
}
function uploadCanceled(evt) {
	console.log("The upload has been canceled by the user or the browser dropped the connection.");
}
