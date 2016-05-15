Date.prototype.format = require('../common/dateFormater');
var express           = require('express');
var router            = express.Router();
var conn              = require('../common/dbConnection');

router.post('/',function(req, res, next){
  if(req.body.type === 'getPage'){
    conn.query('SELECT * FROM `xblog_userinfo` INNER JOIN  `xblog_articles` ON `xblog_userinfo`.`uid` = `xblog_articles`.`uid` WHERE `status` = 1 ORDER BY `cid` DESC LIMIT ?,?', [parseInt(req.body.start), parseInt(req.body.length)], function(err, rows, fields){
      if(err) {
        console.log(err.message);
        res.status(500).send('err 500');
      }
      if(rows.length === 0){
        res.send({
          errcode:2333,
          msg:'已无更多'
        });
      }else{
        var atcs = {};
        var dt = new Date();
        for(var i=0;i<rows.length;i++){
          dt.setTime(rows[i].date * 1000);
          atcs[parseInt(rows[i].cid)] = {
            cid: rows[i].cid,
            title: rows[i].title,
            date: dt.format('yyyy-MM-dd'),
            name: rows[i].name,
            content: (rows[i].content.length>50) ? (rows[i].content.substr(0, 50) + '...') : (rows[i].content),
          };
        }
        res.send(atcs);
      }
    });
  }else{
    res.send({
      errcode:233,
      msg:'你是不是发送了错误的参数= =||'
    });
  }
});


module.exports = router;