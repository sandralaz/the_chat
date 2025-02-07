const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Eliminar el middleware para encriptar contraseñas
// No es necesario este código si no quieres hashear las contraseñas
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// Eliminar el método para comparar contraseñas usando bcrypt
// No es necesario si estamos guardando las contraseñas en texto plano
// userSchema.methods.comparePassword = function (candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

const User = mongoose.model('User', userSchema);
module.exports = User;

