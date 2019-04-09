
// =====

process.env.PORT = process.env.PORT || 3000;

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//Database

let urlDB;

//Vencimiento del token

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//Seed de autenticación

process.env.SEED = process.env.SEED || 'este-es-el-secret-dllo';

if(process.env.NODE_ENV === "dev" ){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URL;
}

process.env.urlDB = urlDB;