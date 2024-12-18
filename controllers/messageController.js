const Message = require('../models/message');
const Chat = require('../models/chat');

const sendMessage = async (req, res) => {
  const { id_chat, mensaje } = req.body;

  try {
    const chat = await Chat.findById(id_chat);
    if (!chat || !chat.activo) {
      return res.status(404).json({ message: 'Chat no encontrado o cerrado' });
    }

    const newMessage = new Message({ id_chat, id_usuario: req.user.id, mensaje });
    await newMessage.save();
    res.status(200).json({ message: 'Mensaje enviado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al enviar mensaje' });
  }
};

const getMessages = async (req, res) => {
  const { id_chat } = req.params;

  try {
    const messages = await Message.find({ id_chat }).populate('id_usuario', 'nombre');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener mensajes' });
  }
};

module.exports = { sendMessage, getMessages };
