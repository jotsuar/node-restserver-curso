const express = require('express');
const app = express();
const {verificaTokenImg} = require('../middlewares/autenticacion')
const fs = require('fs');
const path = require('path');

app.get('/imagen/:tipo/:img',verificaTokenImg,(req,res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, '../../uploads/'+tipo+'/' + img);

    let pathNoImage = path.resolve(__dirname,'../assets/no-image.jpg');

    if (fs.existsSync(pathImagen)){
        return res.sendFile(pathImagen)
    }

    res.sendFile(pathNoImage);

});

module.exports = app;