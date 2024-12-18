const Cliente = require('../models/Cliente');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Crear un nuevo cliente
exports.crearCliente = async (req, res) => {
    try {
        const { nombre, correo, telefono, dni, contrasena } = req.body;

        // Validación de los campos obligatorios
        if (!nombre || !correo || !telefono || !dni || !contrasena) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Crear el cliente en la colección Cliente
        const cliente = new Cliente({ nombre, correo, telefono, dni });
        await cliente.save();

        // Crear el usuario en la colección User
        const user = new User({
            nombre,
            correo,
            contrasena,
            rol: 'cliente',
            referenciaId: cliente._id
        });

        // Encriptar la contraseña antes de guardar el usuario
        user.contrasena = await bcrypt.hash(user.contrasena, 10);
        await user.save();

        // Responder con el token
        res.status(201).json({
            message: 'Cliente y usuario registrados exitosamente',
        });
    } catch (err) {
        res.status(500).json({ message: 'Error en registro: ' + err.message });
    }
};

// Obtener todos los clientes
exports.obtenerClientes = async (req, res) => {
    try {
        const clientes = await Cliente.find();
        if (!clientes || clientes.length === 0) {
            return res.status(404).send({ success: true, message: 'No se encontraron clientes' });
        }
        res.status(200).json(clientes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener un cliente por su ID
exports.obtenerClientePorId = async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id);
        if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
        res.status(200).json({ success: true, cliente });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Actualizar un cliente por su ID
exports.actualizarCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
        res.status(200).json({ success: true, cliente });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Eliminar un cliente por su ID
exports.eliminarCliente = async (req, res) => {
    try {
        // Buscar el cliente por su ID
        const cliente = await Cliente.findById(req.params.id);
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        // Buscar el usuario relacionado con el cliente
        const user = await User.findOne({ referenciaId: cliente._id, rol: 'cliente' });
        if (!user) {
            return res.status(404).json({ error: 'Usuario relacionado no encontrado' });
        }

        // Eliminar el cliente de la colección Cliente
        await Cliente.findByIdAndDelete(req.params.id);

        // Eliminar el documento de User relacionado
        await User.findByIdAndDelete(user._id);

        res.status(200).json({ success: true, message: 'Cliente y usuario eliminado con éxito' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};