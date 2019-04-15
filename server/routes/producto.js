const expres = require("express");
let { verificaToken } = require('../middlewares/autenticacion')
const app = expres();
const Producto = require("../models/producto");


//
// Mostrar todas los productos
//
app.get("/productos", verificaToken, (req,res) => {
    Producto.find({})
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err,productos) => {
        if(err){
            res.status(400).json({
                ok: false,
                err: err,
            })
        }
        res.json({
            ok: true,
            productos,
        })
    } );
});

//
// Mostrar un producto
//
app.get("/productos/:id", verificaToken, (req,res) => {
    let id = req.params.id;
    Producto.findById(id, (err,producto) => {
        if(err){
            res.status(400).json({
                ok: false,
                err: err,
            })
        }
        if(!producto){
            return res.status(400).json({
                ok: false,
                err: {
                    msg: "Producto no existe"
                },
            })
        }
        res.json({
            ok: true,
            producto,
        })
    })
});

//
// Buscar un producto
//
app.get("/productos/buscar/:termino", verificaToken, (req,res) => {
    let termino = req.params.termino;
    var regex = new RegExp(termino, 'i');
    Producto.find({nombre: regex})
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err,productos) => {
        if(err){
            res.status(400).json({
                ok: false,
                err: err,
            })
        }
        res.json({
            ok: true,
            productos,
        })
    } );
});

//
// Crear un producto
//
app.post("/productos", verificaToken, (req,res) => {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save( (err, newCategory) => {
        if(err){
            res.status(500).json({
                ok: false,
                err: err,
            })
        }else{
            if(!newCategory){
                return res.status(400).json({
                    ok: false,
                    err: err,
                })
            }
            res.json({
                ok: true,
                categoria: newCategory
            })
        }
    })

});

//
// Editar un producto
//
app.put("/productos/:id", verificaToken, (req,res) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate(id,body,{new: true,runValidators: true}, (err, producto) => {
        if(err){
            res.status(400).json({
                ok: false,
                err: err,
            })
        }else{
            if(!producto){
                return res.status(400).json({
                    ok: false,
                    err: err,
                })
            }
            res.json({
                ok: true,
                producto
            })
        }
    })

});

//
// Eliminar un producto
//
app.delete("/productos/:id", verificaToken, (req,res) => {
    let id = req.params.id;
    let body = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id,body,{new: true,runValidators: true}, (err, producto) => {
        if(err){
            res.status(400).json({
                ok: false,
                err: err,
            })
        }else{
            if(!producto){
                return res.status(400).json({
                    ok: false,
                    err: err,
                })
            }
            res.json({
                ok: true,
                producto
            })
        }
    })
});


module.exports = app;