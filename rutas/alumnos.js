var express = require('express');
var router = express.Router();
const {authenticateToken} = require('../config/jwt')
const connection = require('../config/mysql');

router.get('/',authenticateToken,(req,res) => {
	res.status(200).json({
		message: 'Ruta alterna'
	});
});
router.get('/listar',authenticateToken,(req, res)=>{
	connection.query("select * from alumnos",  (err, rows, fields)=>{
		if(err){
			res.json({status: 500, message: err});
			}else{
				if(rows.length>0){
				res.json({
					status: 200,
					message:"datos consultados",
					data: rows});
			}else{
				res.json({status: 404, message: 'No hay datos'});
			}
			}
	});
});

//función para crear un alumno
router.post('/create',authenticateToken,(req, res)=>{
	const {apellidos, nombres, codigo, sexo} = req.body;
	const query = "INSERT INTO alumnos SET ?";
	const data = {apellidos, nombres, codigo, sexo};
	connection.query(query, data, (err, rows, fields)=>{
		if(err){
			res.status(500).json({status: 500, message: err});
			}else{
				res.status(200).json({status: 200, message: 'Alumno creado con exito'});
				}
			});
		});

//función para editar un alumno
router.put('/update/:id',authenticateToken,(req, res)=>{
	const {id} = req.params;
	const {apellidos, nombres, codigo, sexo} = req.body;
	const query = "UPDATE alumnos SET ? WHERE idalumnos = ?";
	const data = {apellidos, nombres, codigo, sexo};
	connection.query(query, [data, id], (err, rows, fields)=>{
		if(err){
			res.status(500).json({status: 500, message: err});
			}else{
				res.status(200).json({status: 200, message: 'Alumno actualizado con exito'});
			}
		});
	});

//función para eliminar un alumno
router.delete('/delete/:id',authenticateToken,(req, res)=>{
	const {id} = req.params;
	const query = "DELETE FROM alumnos WHERE idalumnos = ?";
	connection.query(query, id, (err, rows, fields)=>{
		if(err){
			res.status(500).json({status: 500, message: err});
			}else{
				res.status(200).json({status: 200, message: 'Alumno eliminado con exito'});
			}
		});
	});

//función para mostrar un solo alumno
router.get('/show/:id',authenticateToken,(req, res)=>{
	const {id} = req.params;
	const query = "SELECT * FROM alumnos WHERE idalumnos = ?";
	connection.query(query, id, (err, rows, fields)=>{
		if(err){
			res.status(500).json({status: 500, message: err});
			}else{
				if(rows.length >0){
					res.status(200).json({
						status: 200,
						message: "datos consultados",
						data:rows});
				} else {
					res.status(200).json({
						message:"no se encontraron resultados"
					})
				}
			}
		});
	});

//función para consultar alumnos por grado y sección
router.get('/listar/:carrera/:grado/:seccion',authenticateToken,(req,res)=>{
	const {grado, seccion, carrera} = req.params;
	const query = "select a.idalumnos, a.apellidos, a.nombres, a.codigo, a.sexo, asa.gradoyseccion from alumnos as a "
	+ "inner join asignacionalumnos as asa on asa.alumno  = a.idalumnos "
	+ "inner join gradosysecciones g on asa.gradoyseccion = g.idgradosysecciones "
	+ "inner join carreras as c on g.idcarreras = c.idcarreras	"
	+ "where g.grado = ? and g.seccion = ? and c.idcarreras = ?"
	+ " order by a.apellidos, a.nombres DESC";
	connection.query(query,[grado,seccion, carrera],(err,rows,fields)=>{
		if(err){
			res.status(500).json({status: 500, message: err});
		}else{
			if(rows.length > 0) {
				res.status(200).json({
					message:"datos consultados",
					data:rows
				});
			} else {
				res.status(200).json({
					message: "No se encontraron resultados"
				})
			}
		}
	})
})


//función para consultar alumnos por grado
router.get('/listar/:carrera/:grado',authenticateToken,(req,res)=>{
	const {grado, carrera} = req.params;
	const query = "select a.idalumnos, a.apellidos, a.nombres, a.codigo, a.sexo from alumnos as a "
	+ "inner join asignacionalumnos as asa on asa.alumno  = a.idalumnos "
	+ "inner join gradosysecciones g on asa.gradoyseccion = g.idgradosysecciones "
	+ "inner join carreras as c on g.idcarreras = c.idcarreras "
	+ "where g.grado = ? and c.idcarreras = ?"
	connection.query(query,[grado, carrera],(err,rows,fields)=>{
		if(err){
			res.status(500).json({status: 500, message: err});
		}else{
			if(rows.length > 0) {
				res.status(200).json(rows);
			} else {
				res.status(200).json({
					message: "No se encontraron resultados"
				})
			}
		}
	})
})

//función para consultar alumnos por carrera
router.get('/listar/:carrera',authenticateToken,(req,res)=>{
	const {carrera} = req.params;
	const query = "select a.idalumnos, a.apellidos, a.nombres, a.codigo, a.sexo from alumnos as a "
	+ "inner join asignacionalumnos as asa on asa.alumno  = a.idalumnos "
	+ "inner join gradosysecciones g on asa.gradoyseccion = g.idgradosysecciones "
	+  "inner join carreras as c on g.idcarreras = c.idcarreras "
	+ "where c.idcarreras = ?"
	connection.query(query,[carrera],(err,rows,fields)=>{
		if(err){
			res.status(500).json({status: 500, message: err});
		}else{
			if(rows.length > 0) {
				res.status(200).json(rows);
			} else {
				res.status(200).json({
					message: "No se encontraron resultados"
				})
			}
		}
	})
})
module.exports = router;
