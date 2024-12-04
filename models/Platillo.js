const { Schema, model } = require('mongoose');

const platilloSchema = new Schema({
    nombre: { type: String, required: true },
    ingredientes: { type: [String], required: true },
    precio: { type: Number, required: true },
    imagenes: { type: [String], required: false },
});

module.exports = model('Platillo', platilloSchema);
