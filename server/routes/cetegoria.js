const expres = require("express");
let { verificaRol_admin,verificaToken } = require('../middlewares/autenticacion')
const app = expres();

const Categoria = require("../models/categoria");

//
// Mostrar todas las categorias
//
app.get("/categoria", verificaToken, (req,res) => {
    Categoria.find({})
        .populate('usuario', 'nombre email')
        .exec((err,categorias) => {
        if(err){
            res.status(400).json({
                ok: false,
                err: err,
            })
        }
        res.json({
            ok: true,
            categorias,
        })
    } );
});

//
// Mostrar una categoria
//
app.get("/categoria/:id", verificaToken, (req,res) => {
    let id = req.params.id;
    Categoria.findById(id, (err,categoria) => {
        if(err){
            res.status(400).json({
                ok: false,
                err: err,
            })
        }
        if(!categoria){
            return res.status(400).json({
                ok: false,
                err: {
                    msg: "Categoria no existe"
                },
            })
        }
        res.json({
            ok: true,
            categoria,
        })
    })
});

//
// Crear una categorias
//
app.post("/categoria", verificaToken, (req,res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save( (err, newCategory) => {
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
// Editar una categoria
//
app.put("/categoria/:id", verificaToken, (req,res) => {
    let id = req.params.id;
    let body = req.body;

    Categoria.findByIdAndUpdate(id,body,{new: true,runValidators: true}, (err, categoria) => {
        if(err){
            res.status(400).json({
                ok: false,
                err: err,
            })
        }else{
            if(!categoria){
                return res.status(400).json({
                    ok: false,
                    err: err,
                })
            }
            res.json({
                ok: true,
                categoria
            })
        }
    })

});

//
// Eliminar una categoria
//
app.delete("/categoria/:id", [verificaToken,verificaRol_admin], (req,res) => {
    let id = req.params.id;
    Categoria.findByIdAndDelete(id, (err, categoria) => {
        if(err){
            res.status(400).json({
                ok: false,
                err: err,
            })
        }else{
            res.json({
                ok: true,
                categoria
            })
        }
    })
});

module.exports = app;