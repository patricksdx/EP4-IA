const Categoria = require('../models/Categoria');

exports.crearCategoria = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        // Validación para verificar si el nombre está vacío
        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({ message: 'El nombre de la categoría es obligatorio' });
        }

        // Validación para verificar si la descripción está vacía
        if (!descripcion || descripcion.trim() === '') {
            return res.status(400).json({ message: 'La descripción de la categoría es obligatoria' });
        }

        const categoria = new Categoria({ nombre, descripcion });
        await categoria.save();
        res.status(201).json({ success: true, categoria });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al crear la categoría');
    }
};

exports.obtenerCategorias = async (req, res) => {
    try {
        const { nombre } = req.body;

        const categorias = nombre
            ? await Categoria.find({ nombre: { $regex: nombre, $options: 'i' } })
            : await Categoria.find();

        if (!categorias || categorias.length === 0) {
            return res.status(404).send({success: true , message : 'No se encontraron categorías'});
        }
        res.json({ success: true, categorias });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al obtener las categorías');
    }
};

exports.actualizarCategoria = async (req, res) => {
    try {
        const { nombre } = req.body; // El nombre es el que se usa para buscar la categoría
        const { nuevoNombre, nuevaDescripcion } = req.body; // Nuevos valores para nombre y descripción

        // Validaciones para verificar si los campos están vacíos
        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({ message: 'El nombre de la categoría es obligatorio para buscarla' });
        }
        if (!nuevoNombre || nuevoNombre.trim() === '') {
            return res.status(400).json({ message: 'El nuevo nombre de la categoría es obligatorio' });
        }
        if (!nuevaDescripcion || nuevaDescripcion.trim() === '') {
            return res.status(400).json({ message: 'La nueva descripción de la categoría es obligatoria' });
        }

        // Actualizamos la categoría por nombre
        const categoria = await Categoria.findOneAndUpdate(
            { nombre }, // Filtramos por nombre
            { $set: { nombre: nuevoNombre, descripcion: nuevaDescripcion } }, // Actualizamos los campos
            { new: true } // Devolvemos el documento actualizado
        );

        if (!categoria) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        res.json({ success: true, categoria });
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error al actualizar la categoría');
    }
};

// Método para eliminar una categoría por nombre
exports.eliminarCategoria = async (req, res) => {
    try {
        const { nombre } = req.body;  // El nombre es el que se usa para eliminar la categoría

        const categoria = await Categoria.findOneAndDelete({ nombre });

        if (!categoria) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        res.json({ success: true, message: 'Categoría eliminada exitosamente' });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al eliminar la categoría');
    }
};