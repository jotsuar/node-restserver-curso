
// =====

process.env.PORT = process.env.PORT || 3000;

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//Database

let urlDB;

if(process.env.NODE_ENV === "env"){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = 'mongodb+srv://jotsuar:Medellin1.@cluster0-wjfgo.mongodb.net/cafe?retryWrites=true';
}

process.env.urlDB = urlDB;