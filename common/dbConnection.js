var mysql = require('mysql');
var pool = mysql.createPool(require('../config/db'));

var conn = {};

conn.query = function(sql, func){
	pool.getConnection(function(err, con){
		if(err) {
			console.log(err.message);
		}
		con.query(sql,func);
		con.release();
	});
};

module.exports = conn;