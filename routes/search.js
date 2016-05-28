Date.prototype.format = require('../common/dateFormater');
var express           = require('express');
var router            = express.Router();
var conn              = require('../common/dbConnection');

router.get('/s',function(req, res, next){
  if(req.query.word){
    conn.query('SELECT `xblog_userinfo`.`uid`,`xblog_userinfo`.`name`,`xblog_userinfo`.`email`,`xblog_userinfo`.`password`,`xblog_userinfo`.`url`,`xblog_userinfo`.`registered`,`cid`,`title`,`content`,`tags`,`categories`,`date`,`status`,`commentstatus`,`priority` FROM `xblog_userinfo` INNER JOIN  `xblog_articles` ON `xblog_userinfo`.`uid` = `xblog_articles`.`uid` WHERE `status` = 1 AND (`xblog_articles`.`title` LIKE ? OR `xblog_articles`.`content` LIKE ?)',['%'+req.query.word+'%','%'+req.query.word+'%'],function(err, rows, fields){
    var date = new Date();
    if(err) {
      console.log(err.message);
      res.status(500).send('err 500');
    }
    for(var i=0;i<rows.length;i++){
      //将时间格式化成yyyy-mm-dd的形式
      date.setTime(rows[i].date * 1000);
      rows[i].date = date.format('yyyy-MM-dd');

      //把内容省略化
      if(rows[i].content.length > 100){
        rows[i].content = rows[i].content.substr(0,100).replace(/\n/g, ' ').replace(/[#*`]/g,'') + '...';
      }
    }
    res.render('search',{
      articles: rows,
      siteTitle: req.query.word + ' | zzliux\'s blog',
      reqTime: req.requestTime
    });
   });
  }else{
    res.status(404).render('404',{
      siteTitle : '404 | zzliux\'s blog',
      reqTime: req.requestTime
    });
  }
});

router.get('/:method/:word',function(req, res, next){
  var method;
  var sql;
  var sqlParam;
  var flag = false;
  if(req.params.method === 'tag'){
    sql = 'SELECT `xblog_userinfo`.`uid`,`xblog_userinfo`.`name`,`xblog_userinfo`.`email`,`xblog_userinfo`.`password`,`xblog_userinfo`.`url`,`xblog_userinfo`.`registered`,`cid`,`title`,`content`,`tags`,`categories`,`date`,`status`,`commentstatus`,`priority` FROM `xblog_userinfo` INNER JOIN  `xblog_articles` ON `xblog_userinfo`.`uid` = `xblog_articles`.`uid` WHERE `status` = 1 AND (`xblog_articles`.`tags` REGEXP ?)';
    sqlParam = ['.*,?'+ req.params.word +',?.*'];
    flag = true;
  }else if(req.params.method === 'category'){
    sql = 'SELECT `xblog_userinfo`.`uid`,`xblog_userinfo`.`name`,`xblog_userinfo`.`email`,`xblog_userinfo`.`password`,`xblog_userinfo`.`url`,`xblog_userinfo`.`registered`,`cid`,`title`,`content`,`tags`,`categories`,`date`,`status`,`commentstatus`,`priority` FROM `xblog_userinfo` INNER JOIN  `xblog_articles` ON `xblog_userinfo`.`uid` = `xblog_articles`.`uid` WHERE `status` = 1 AND (`xblog_articles`.`categories` REGEXP ?)';
    sqlParam = ['.*,?'+ req.params.word +',?.*'];
    flag = true;
  }else if(req.params.method === 'user'){
    sql = 'SELECT `cid`,`title`,`content`,`tags`,`categories`,`date`,`status`,`commentstatus`,`priority`,? as `name` FROM `xblog_articles` WHERE `uid` = (SELECT `uid` FROM `xblog_userinfo` WHERE `name` = ?) AND `status` = 1';
    sqlParam = [req.params.word,req.params.word];
    flag = true;
  }else{
    res.render('404',{
      siteTitle: '404 | zzliux\'s blog',
      reqTime: req.requestTime
    });
  }
  if(flag){
    conn.query(sql, sqlParam, function(err, rows, fields){
      var date = new Date();
      for(var i=0;i<rows.length;i++){
        //将时间格式化成yyyy-mm-dd的形式
        date.setTime(rows[i].date * 1000);
        rows[i].date = date.format('yyyy-MM-dd');

        //把内容省略化
        if(rows[i].content.length > 100){
          rows[i].content = rows[i].content.substr(0,100).replace(/\n/g, ' ').replace(/[#*`]/g,'') + '...';
        }
      }
      res.render('search',{
        articles: rows,
        siteTitle: req.params.word + ' | zzliux\'s blog',
        reqTime: req.requestTime
      });
    });
  };
})

module.exports = router;