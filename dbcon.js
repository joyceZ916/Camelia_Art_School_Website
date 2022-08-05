var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_zanq',
  password        : 'Php850418',
  database        : 'cs340_zanq'
});

module.exports.pool = pool;
