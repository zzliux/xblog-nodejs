Date.prototype.format = require('../common/dateFormater');
var express           = require('express');
var router            = express.Router();
var rss               = require('rss');
var md                = require('marked');
var conn              = require('../common/dbConnection');


router.get('/', function(req, res){
	conn.query('SELECT `xblog_userinfo`.`uid`,`xblog_userinfo`.`name`,`xblog_userinfo`.`email`,`xblog_userinfo`.`password`,`xblog_userinfo`.`url`,`xblog_userinfo`.`registered`,`cid`,`title`,`content`,`tags`,`categories`,`date`,`status`,`commentstatus`,`priority` FROM `xblog_userinfo` INNER JOIN  `xblog_articles` ON `xblog_userinfo`.`uid` = `xblog_articles`.`uid` WHERE `status` = 1 ORDER BY `cid` DESC LIMIT 0,20', function(err, rows, filed){
		if(err) {
			console.log(err.message);
			res.status(500).send('err 500');
		}
		var date = new Date();
		var tags = {};
		var categories = {};
		var feed = new rss({
			title:'zzliux\'s blog',
			feed_url: 'https://www.zzliux.cn/feed',
			site_url: 'https://www.zzliux.com',
			image_url: 'https://www.zzliux.com/favicon.ico',
		});

		for(var i=0;i<rows.length;i++){
			//将时间格式化成yyyy-mm-dd的形式

			//markdown to html
			rows[i].content = rows[i].content.substr(0,100).replace(/\n/g, ' ').replace(/[#*`]/g,'') + '...';

			feed.item({
				title: rows[i].title,
				date: rows[i].date * 1000 - 480000,
				author: rows[i].name,
				url: 'https://www.zzliux.cn/article/' + rows[i].cid,
				guid: rows[i].id,
				categories: rows[i].categories.split(','),
				description: rows[i].content
			});
		}
		res.setHeader('Content-Type','application/xml');
		res.send(feed.xml());
	});
})

module.exports = router;
