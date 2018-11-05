const mysql = require("mysql")

var connection = mysql.createConnection({
    host: 'vinda-mysql',
    user: 'root',
    password: 'tt1234',
    port: 3306,
    database: 'vinda_pro'
});
connection.connect();

module.exports = connection