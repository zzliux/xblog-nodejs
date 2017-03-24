(function(){
	function getAllCid(){
		var arr = [];
		$('.t_by_cid').each(function(){
			arr.push(this.getAttribute('cid'));
		});
		return arr.join(',');
	}
})()
