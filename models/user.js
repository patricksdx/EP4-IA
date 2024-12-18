const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  rol: { type: String, enum: ['cliente', 'mesero'], required: true },
  contrasena: { type: String, required: true },

  referenciaId: { type: mongoose.Schema.Types.ObjectId, refPath: 'rol' }
});

// Método para encriptar la contraseña antes de guardar el usuario
userSchema.pre('save', async function(next) {
  if (!this.isModified('contrasena')) return next();
  const salt = await bcrypt.genSalt(10);
  this.contrasena = await bcrypt.hash(this.contrasena, salt);
  next();
});

// Método para comparar la contraseña ingresada con la almacenada
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.contrasena);
};

module.exports = mongoose.model('User', userSchema);