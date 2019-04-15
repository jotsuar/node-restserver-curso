const mongose = require("mongoose");
const Schema = mongose.Schema;

let categoriaSechema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: true,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "Usuario"
    }
});

module.exports = mongose.model("Categoria", categoriaSechema);