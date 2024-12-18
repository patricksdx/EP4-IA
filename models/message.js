const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  id_chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
  id_usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mensaje: { type: String, required: true },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);