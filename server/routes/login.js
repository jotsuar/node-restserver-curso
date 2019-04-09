const express = require('express');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const app = express()

//const bodyParser = require('body-parser');

app.post('/login', (req,res) => {
    let body = req.body;

    Usuario.findOne({
        email: body.email,
        //password: bcrypt.hashSync(body.password,3)
    },(err,usuarioDb)=>{
        if(err){
            res.status(500).json({
                ok:false,
                err
            });
        }
        if(!usuarioDb){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El (usuario) y/o contraseña no son válidos'
                }
            })
        }

        if(!bcrypt.compareSync(body.password, usuarioDb.password)){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario y/o (contraseña) no son válidos'
                }
            })
        }

        let token = jwt.sign({
            usuario:usuarioDb,
        },process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN})

        res.json({
            ok:true,
            usuario: usuarioDb,
            token
        });
       
    })
    
});

module.exports = app;