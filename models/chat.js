const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  id_usuario_cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  id_usuario_soporte: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  activo: { type: Boolean, default: true }
});

// Evitar redefinir el modelo si ya está definido
const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);

module.exports = Chat;