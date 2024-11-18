const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const secret = "Salama#12"
//generar el token para el usuario
const generarJWT = (usuario) => {
    const playload = {
        id: usuario.idmaestros,
        nombre: usuario.nombres,
        apellido: usuario.apellidos,
        email: usuario.email,
        rol: 'usuario'
    }
    const options = {expiresIn:"1h"}
    return jwt.sign(playload,secret,options)
}
//generar el token para el maestro 
const generarJWTMaestro = (usuario) => {
  const playload = {
      id: usuario[0].idmaestros,
      nombre: usuario[0].nombres,
      apellido: usuario[0].apellidos,
      email: usuario[0].email,
      rol: 'maestro'
  }
  const options = {expiresIn:"1h"}
  return jwt.sign(playload,secret,options)
}
function verifyAccessToken(token) {

  try {
    const decoded = jwt.verify(token, secret);
    return { success: true, data: decoded };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  // console.log(authHeader)
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  const result = verifyAccessToken(token);

  if (!result.success) {
    return res.json({ message: "No autenticado ...",
      error: result.error });
  }

  req.user = result.data;
  next();
}

//verificamos retornamos los datos del ususario identificado
function retornaDatos(token) {

  try {
    const decoded = jwt.verify(token, secret);
    return { success: true, data: decoded };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function salirSession(token){
  const salir = jwt.destroy(token)
  console.log(salir)
  if(salir){
    return true;
  } else {
    return false;
  }
}
module.exports = {
  authenticateToken,
  verifyAccessToken,
  generarJWT,
  generarJWTMaestro,
  retornaDatos,
  salirSession
}
