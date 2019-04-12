const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const { OAuth2Client } = require('google-auth-library');
const CLIENT = new OAuth2Client(process.env.CLIENT_ID);
const app = express()

//const bodyParser = require('body-parser');

app.post('/login', (req, res) => {
    let body = req.body;

    Usuario.findOne({
        email: body.email,
        //password: bcrypt.hashSync(body.password,3)
    }, (err, usuarioDb) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El (usuario) y/o contraseña no son válidos'
                }
            })
        }

        if (!bcrypt.compareSync(body.password, usuarioDb.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario y/o (contraseña) no son válidos'
                }
            })
        }

        let token = jwt.sign({
            usuario: usuarioDb,
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDb,
            token
        });

    })

});

async function verify(token) {
       
    const ticket = await CLIENT.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
   
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google:true,
    }

}

app.post('/google', async (req, res) => {
 
    let token = req.body.idtoken;
    let googleUser = await verify(token)
                            .catch(err => {res.status(403).json({ok:false,err})});

    Usuario.findOne({email: googleUser.email}, (err,usuarioDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }

        if(usuarioDB){
            if(usuarioDB.google === false){
                res.status(400).json({
                    ok: false,
                    err:{
                        msg: "Debe usar una autentiación normal"
                    }
                });
            }else{
                let token = jwt.sign({
                    usuario: usuarioDB,
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    token,
                    ok: true,
                    usuario: usuarioDB
                })
            }
        }else{
            let usuario = new Usuario();

            usuario.nombre = usuarioDB.nombre;
            usuario.email = usuarioDB.email;
            usuario.img = usuarioDB.img;
            usuario.google = usuarioDB.google;
            usuario.password = ':)';
            usuario.save((err,usuarioDB)=>{
                
                if(err){
                    res.status(500).json({
                        ok: false,
                        err
                    });
                }
                let token = jwt.sign({
                    usuario: usuarioDB,
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    token,
                    ok: true,
                    usuario: usuarioDB
                })
            })
        }
    })
    
    res.json({
        usuario : googleUser
    })
})

module.exports = app;