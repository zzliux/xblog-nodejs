(function(){
	var imgArr = document.getElementsByTagName('img');
	if(imgArr.length>0){
		var t = document.createElement('div');
		t.setAttribute('id','fullImgC');
		t.style.cssText = 'display:none;position:fixed;z-index:999;top:0px;left:0px;width:100%;text-align:center;background:rgba(0,0,0,0.9);';
		document.getElementsByTagName('body')[0].appendChild(t);
	}
	for(var k=0;k<imgArr.length;k++){
		if(imgArr[k].src.indexOf('thumb/')>0){
			imgArr[k].style.cursor = "pointer";
			imgArr[k].addEventListener('click',function(e){
				showFullImg(e.target.src);
			},false);
		}
	}
	if(imgArr.length>0){
		document.getElementById('fullImgC').addEventListener('click',function(){
			document.getElementById('fullImgC').style.display="none";
		},false);
	}
	function showFullImg(thumbUrl){
		var c = document.getElementById('fullImgC');
		var fullUrl = thumbUrl.replace('thumb/','origin/');
		c.innerHTML = '<span style="display:table-cell;vertical-align:middle;"><img src="' + fullUrl + '" style="cursor:pointer;" id="fullImg"></span>';
		c.style.display = 'table';
		c.style.height = window.innerHeight + 'px';
		document.getElementById('fullImg').style.maxWidth = (window.innerWidth * 0.9) + 'px';
		document.getElementById('fullImg').style.maxHeight = (window.innerHeight * 0.9) + 'px';
	}
})();