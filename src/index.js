const mysql = require("mysql")

var connection = mysql.createConnection({
    host: 'ixiaotang.cn',
    user: 'root',
    password: 'tt1234',
    port: 3307,
    database: 'vinda_dev'
});
connection.connect();

module.exports = connection