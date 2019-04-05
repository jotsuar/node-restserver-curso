require('./config/config');
require('mongoose');

const express = require('express')
const app = express()
const bodyParser = require('body-parser');

app.use(require('./routes/usuario'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

const mongoose = require('mongoose');
 
//mongoose.connect('mongodb://localhost:27017/cafe', {useNewUrlParser: true});
mongoose.connect(process.env.urlDB, {useNewUrlParser: true, useCreateIndex: true},(err)=>{
    if(err) throw err;
    console.log(process.env.urlDB)
    console.log("database online")
});

app.listen(process.env.PORT, ()=>{
    console.log("Escuchando puerto: " + process.env.PORT)
})

