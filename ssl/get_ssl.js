/* 配置域名信息 */
var domains = ['zzliux.com', 'www.zzliux.com'];



var request = require("request");

var options = {
	method: 'GET',
	url: 'https://www.sslforfree.com/create',
	qs: { domains: domains.join('%20') },
	headers:{
		'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36',
		connection: 'keep-alive'
	}
};

request(options, function (err, res, body) {
	if (err) throw new Error(err);
	var cookies = [];
	var reg = /(.+?);/;
	for(var i=0; i<res.headers['set-cookie'].length; i++){
		if(reg.exec(res.headers['set-cookie'])){
			cookies.push(RegExp.$1);
		}
	}
/*	options.headers.cookie = cookies.join('; ');
	options.headers['content-type'] = 'multipart/form-data; boundary=----WebKitFormBoundarywaCeXfmfUjjfp1ix';
	options.method = 'POST';
	options.body = '------WebKitFormBoundarywaCeXfmfUjjfp1ix\nContent-Disposition: form-data; name="manual"\n\n1\n------WebKitFormBoundarywaCeXfmfUjjfp1ix--';
	*/
	request({
		url: 'https://acme-v01.api.letsencrypt.org/directory?cachebuster='+(new Date()).getTime(),
		method: 'GET'
	}, function(err, res, body){
		//返回几个网址
		// console.log(body);
		request({
			url: 'https://www.sslforfree.com/create?nonce='+res.headers['replay-nonce'],
			method: 'GET'
		},function(err, res, body){
			//返回jwk
			// console.log(body);
			request({
				url:'https://acme-v01.api.letsencrypt.org/acme/new-reg',
				method: 'POST',
				headers:{
					'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
					referer:'https://www.sslforfree.com/create?domains='+domains.join('%20')
				},
				body: "resource=new-reg&agreement="+encodeURI('https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf'),
			}, function(err, res, body){
				console.log(body);
			});
		})
	});
});
