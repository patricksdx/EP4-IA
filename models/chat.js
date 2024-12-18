const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  id_usuario_cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  id_usuario_soporte: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  activo: { type: Boolean, default: true }
});

module.exports = mongoose.model('Chat', chatSchema);
