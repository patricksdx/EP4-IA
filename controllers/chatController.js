const Chat = require('../models/Chat');

const startChat = async (req, res) => {
  const { id_usuario_cliente, id_usuario_soporte } = req.body;

  try {
    const newChat = new Chat({ id_usuario_cliente, id_usuario_soporte });
    await newChat.save();
    res.status(201).json({ message: 'Chat iniciado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al iniciar chat' });
  }
};

module.exports = { startChat };
