const jwt = require('jsonwebtoken');
//verificar token

let verificaToken = (req, res, next) => {
    let token = req.get('Authorization');
    jwt.verify(token, process.env.SEED, (err, data) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }
        req.usuario = data.usuario;
        next();
    })

};

let verificaRol_admin = (req, res, next) => {

    let token = req.get('Authorization');

    let usuario = req.usuario;

    if (usuario.role != "ADMIN_ROLE") {
        return res.status(401).json({
            ok: false,
            err : {
                msg : "Usuario sin permisos"
            }
        })
    }
    next();

};

module.exports = {
    verificaToken,
    verificaRol_admin
}