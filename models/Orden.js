const { Schema, model } = require('mongoose');


const ordenSchema = new Schema({
    idMesa: { type: Number, required: true },  
    platillos: [
        {
            nombre: { type: String, required: true }, 
            cantidad: { type: Number, required: true } 
        }
    ],
    estado: { 
        type: String, 
        enum: ['pendiente', 'entregado', 'cancelado'], 
        default: 'pendiente' 
    },  
}, { versionKey: false });  


module.exports = model('Orden', ordenSchema);
