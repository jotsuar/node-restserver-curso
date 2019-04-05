const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const _ = require("underscore");

const Usuario = require('../models/usuario');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.post('/usuario', function (req, res) {
    let body = req.body;
    
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 3),
        role: body.role,
    });

    usuario.save( (err,userDb) => {
        if(err){
            res.status(400).json({
                ok: false,
                err: err,
            })
        }else{
            res.json({
                ok: true,
                usuario: userDb
            })
        }
    } )
})

app.get('/usuario', function (req, res) {
    let desde = req.query.desde  || 0;
    let limite = req.query.limite || 5;
    desde = Number(desde);
    limite = Number(limite);

    Usuario.find({estado:false},'nombre email google estado email').skip(desde).limit(limite).exec((err,usuarios) => {
        if(err){
            res.status(400).json({
                ok: false,
                err: err,
            })
        }
        Usuario.countDocuments({estado:false},(err,cuantos)=>{
            if(err){
                res.status(400).json({
                    ok: false,
                    err: err,
                })
            }
            res.json({
                ok: true,
                usuarios: usuarios,
                cuantos,
            })
        })
    })
})

app.delete('/usuario/:id', function (req, res) {
    let id = req.params.id;
    let body = {
        estado: true,
    };

    Usuario.findByIdAndUpdate(id,body, {new:true,runValidators:false}, (err,userDb) => {
        if(err){
            res.status(400).json({
                ok: false,
                err: err,
            })
        }else{
            res.json({
                ok: true,
                usuario: userDb
            })
        }
    });
    return;

    Usuario.findByIdAndRemove(id, (err,usuarioBorrado)=>{
        if(err){
            res.status(400).json({
                ok: false,
                err: err,
            })
        }

        if(usuarioBorrado === null){
            res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario no encontrado"
                }
            })
        }
      
        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
        
    })
})

app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body,['nombre','email','img','role','estado']);

    Usuario.findByIdAndUpdate(id,body, {new:true,runValidators:true}, (err,userDb) => {
        if(err){
            res.status(400).json({
                ok: false,
                err: err,
            })
        }else{
            res.json({
                ok: true,
                usuario: userDb
            })
        }
    })
})

module.exports = app;