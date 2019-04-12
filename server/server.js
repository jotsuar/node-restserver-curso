require('./config/config');
require('mongoose');

const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const path = require('path');

app.use(require('./routes/index'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use(express.static(path.resolve(__dirname,'../public')))

const mongoose = require('mongoose');
 
//mongoose.connect('mongodb://localhost:27017/cafe', {useNewUrlParser: true});
mongoose.connect(process.env.urlDB, {useNewUrlParser: true, useCreateIndex: true},(err)=>{
    if(err) throw err;
    console.log("database online")
});

app.listen(process.env.PORT, ()=>{
    console.log("Escuchando puerto: " + process.env.PORT)
})

