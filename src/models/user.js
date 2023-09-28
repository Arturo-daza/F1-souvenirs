const mongoose = require("mongoose"); // importando el componente mongoose
const bcrypt = require("bcrypt"); // importando el componente bcrypt
const userSchema = mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  pass: {
    type: String,
    required: true,
  },
});
userSchema.methods.encryptClave = async (clave) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(clave, salt);
};
module.exports = mongoose.model("User", userSchema);
