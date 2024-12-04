
const { Schema, model } = require('mongoose');

const meseroSchema = new Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    activo: { type: Boolean, default: true }, 
});

module.exports = model('Mesero', meseroSchema);
