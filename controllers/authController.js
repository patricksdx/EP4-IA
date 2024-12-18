const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { secretKey } = require('../config/global');
const Cliente = require('../models/Cliente');

const registerUser = async (req, res) => {
  const { nombre, correo, telefono, dni, contrasena } = req.body;

  try {
    // Crear el documento Cliente
    const cliente = await Cliente.create({ nombre, correo, telefono, dni });

    // Crear el documento User
    const user = await User.create({
      nombre,
      correo,
      contrasena,
      rol: 'cliente',
      referenciaId: cliente._id
    });

    // Crear el token
    const token = jwt.sign(
      {
        id: user._id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol
      },
      secretKey,
      { expiresIn: '7d' } // Token válido por 7 días
    );

    // Responder con el token
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token
    });
  } catch (err) {
    res.status(500).json({ message: 'Error en registro: ' + err.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;  // El ID del usuario que se va a eliminar

  try {
    // Buscar el usuario por su ID
    const user = await User.findById(id).populate('referenciaId');  // Populamos el campo 'referenciaId' para saber si es un Cliente o Mesero
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Eliminar el usuario de la colección correspondiente
    if (user.rol === 'cliente') {
      await Cliente.findByIdAndDelete(user.referenciaId);  // Eliminar documento relacionado en Cliente
    } else if (user.rol === 'mesero') {
      await Mesero.findByIdAndDelete(user.referenciaId);  // Eliminar documento relacionado en Mesero
    }

    // Eliminar el documento del usuario
    await User.findByIdAndDelete(id);

    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar usuario: ' + err.message });
  }
};

/*
const registerUser = async (req, res) => {
  const { nombre, correo, contrasena, rol } = req.body;

  try {
    const userExists = await User.findOne({ correo });
    if (userExists) {
      return res.status(400).json({ message: 'Usuario ya existe' });
    }

    const user = new User({ nombre, correo, contrasena, rol });
    await user.save();
    res.status(201).json({ message: 'Usuario registrado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};
*/

const loginUser = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    const user = await User.findOne({ correo });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    const isMatch = await user.matchPassword(contrasena);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: user._id, rol: user.rol }, secretKey);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error en login' + err.message });
  }
};

module.exports = { registerUser, loginUser, deleteUser };
