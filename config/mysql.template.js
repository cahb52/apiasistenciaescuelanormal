var mysql      = require('mysql2');
var fs = require("fs");
var connection = mysql.createConnection({
  host :'host',
  user: 'usuario',
  password:'su contraseña',
  database:'asistencia',
  port: 3306,
  ssl : {
    ssl: true,

    cert: fs.readFileSync(__dirname + '/aquielnombredesucertificado.pem'),
    rejectUnauthorized: false
}

});
 
connection.connect();

module.exports  = connection;