const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

app.put('/upload/:tipo/:id', function (req, res) {

    let tipo = req.params.tipo;
    console.log(tipo)
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                msg: 'No se enviaron archivos',
            }
        })
    }

    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                msg: 'El tipo no es válido',
            }
        })
    }

    let archivoo = req.files.archivo;

    let nombreArchivoCortado = archivoo.name.split('.');
    let extencion = nombreArchivoCortado[nombreArchivoCortado.length - 1];

    let extencionesvalidas = ['png', 'jpg', 'jpeg', 'git'];

    if (extencionesvalidas.indexOf(extencion) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                msg: 'Extención no válida'
            }
        })
    }

    let archivoName = `${id}_${new Date().getMilliseconds()}.${extencion}`;

    archivoo.mv(`uploads/${tipo}/${archivoName}`, function (err) {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(tipo == "usuarios"){
            imagenUsuario(id, res, archivoName,tipo);
        }else{
            imagenProducto(id, res, archivoName,tipo); 
        }
        
    })

});

function imagenUsuario(id, res, archivoName,tipo) {
    Usuario.findById(id, (err, usuarioDb) => {
        if (err) {
            borrarArchivo(archivoName,tipo);
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDb) {
            borrarArchivo(archivoName,tipo);
            return res.status(400).json({
                ok: false,
                err: {
                    msg: "Usuario no existe"
                }
            })
        }

        borrarArchivo(usuarioDb.img,tipo);

        usuarioDb.img = archivoName;

        usuarioDb.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                archivo: archivoName
            })
        })

    })

}

function imagenProducto(id, res, archivoName,tipo) {
    Producto.findById(id, (err, productoDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    msg: "Usuario no existe"
                }
            })
        }

        borrarArchivo(productoDb.img,tipo);

        productoDb.img = archivoName;

        productoDb.save((err, productoGuardado) => {
            res.json({
                ok: true,
                usuario: productoGuardado,
                archivo: archivoName
            })
        })

    })

}

function borrarArchivo(archivo,tipo) {
    let pathImagen = path.resolve(__dirname, '../../uploads/'+tipo+'/' + archivo);

    if (fs.existsSync(pathImagen)) {
        fs.unlink(pathImagen)
    }
}


module.exports = app;