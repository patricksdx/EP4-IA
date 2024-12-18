const Mesero = require('../models/Mesero');

// Crear nuevo mesero
exports.crearMesero = async (req, res) => {
    try {
        const { nombre, email } = req.body;

        if (!nombre || !email) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const meseroExistente = await Mesero.findOne({ email });

        if (meseroExistente) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        const mesero = new Mesero({ nombre, email });
        await mesero.save();
        res.status(201).json({ success: true, mesero });
    } catch (error) {
        console.error(error); 
        res.status(500).send('Hubo un error al crear el mesero');
    }
};
// Obtener todos los meseros
exports.obtenerMeseros = async (req, res) => {
    try {
        const meseros = await Mesero.find();
        if (!meseros || meseros.length === 0) {
            return res.status(404).send({ success: false, message: 'No se encontraron meseros'});
        }
        res.json({ success: true, meseros });
    } catch (error) {
        console.error(error); 
        res.status(500).send('Hubo un error al obtener los meseros');
    }
};

// Actualizar mesero
exports.actualizarMesero = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email } = req.body;

        const mesero = await Mesero.findById(id);
        if (!mesero) {
            return res.status(404).send('Mesero no encontrado');
        }

        if (nombre) mesero.nombre = nombre;
        if (email) mesero.email = email;

        await mesero.save();
        res.json({ success: true, mesero });
    } catch (error) {
        console.error(error); 
        res.status(500).send('Hubo un error al actualizar el mesero');
    }
};

// Eliminar mesero (lógicamente, cambiamos el campo activo)
exports.eliminarMesero = async (req, res) => {
    try {
        const { id } = req.params;
        const mesero = await Mesero.findById(id);
        if (!mesero) {
            return res.status(404).send('Mesero no encontrado');
        }
        mesero.activo = false;
        await mesero.save();

        res.json({ success: true, message: 'Mesero eliminado lógicamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error al eliminar el mesero');
    }
};