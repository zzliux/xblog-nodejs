var mysql = require('mysql');
var conn = mysql.createConnection(require('../config/db'));
conn.connect();
module.exports = conn;