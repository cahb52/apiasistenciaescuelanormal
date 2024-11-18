const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const mysql = require('../config/mysql')
const {authenticateToken, generarJWTMaestro, salirSession, retornaDatos} = require('../config/jwt')

router.get('/', authenticateToken, (req, res)=>{

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // console.log(retornaDatos(token))
    const data = retornaDatos(token).data
    const query = "select c.idcursos, c.nombrecurso, c.idgradosysecciones,g.grado, g.seccion, c2.nombre as nombrecarrera, c2.idcarreras from cursos as c "
                +"inner join asignacioncursosmaestros as a on c.idcursos = a.idcursos "
                +"inner join gradosysecciones g on g.idgradosysecciones = c.idgradosysecciones "
                +"inner join carreras c2 on c2.idcarreras = g.idcarreras "
                +"and a.maestro = ? order by c2.idcarreras, g.grado, g.seccion ASC;"
    mysql.query(query,[data.id],(err,result,fields)=>{
        if(err){
            console.log(err)
            res.json({message: "Error al cargar cursos"})
        }else{
            if(result.length > 0) {
                // console.log(result)
                res.json({
                    message:"Los cursos asignados son",
                    data: result
                })

            } else {
                res.json({
                    message:"sin resultados"
                })
            }
        }
    })
})

router.post('/login',(req,res)=>{
    const {email, password} = req.body;
    var pass = crypto.createHash('sha256').update(password).digest('hex');
    const query = "SELECT idmaestros, nombres, apellidos, email FROM maestros WHERE email = ? AND password = ?";
    mysql.query(query, [email, pass], (err, results)=>{
        if(err){
            res.status(500).json({
                message: 'Error al conectar a la base de datos'
            });
        }else{
                if(results.length > 0){
                    const token = generarJWTMaestro(results);
                    res.json({
                    message: 'Bienvenido',
                    token: token
                    });
                }else{
                res.status(401).json({
                message: 'Credenciales incorrectas'
            });
            }
        }
    })

})

router.get('/listar',authenticateToken,(req,res)=>{
    const query = "SELECT idmaestros, nombres, apellidos, email FROM maestros order by nombres, apellidos ASC"
    mysql.query(query, (err, results)=>{
        if(err){
            res.status(500).json({
                message: err
            })
        }else{
            res.json({
                message: 'Maestros',
                data: results
            })
        }
    })
})


//listar los cursos asignados por docente autenticado
router.get('/listarCursos',authenticateToken,(req,res)=>{
       
    res.json({message:"prueba"});

})


router.get('/salir',authenticateToken,(req,res)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.json({
            message:"error"
        })
    } else {
        if(salirSession(token)){
            res.json({
                message:"success"
            })
        }else{
            res.json({
                message:"notoken"
            })
        }
    }
})


module.exports = router;
