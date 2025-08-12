import bcrypt from "bcrypt";

const SALT_ROUNDS = 10; // número de rondas, un equilibrio entre seguridad y tiempo de proceso

// Para crear el hash al registrar un usuario:
async function hashPassword(password: string) {
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  return hash;
}

// Para verificar la contraseña al iniciar sesión:
async function verifyPassword(password: string, hash: string) {
  const isValid = await bcrypt.compare(password, hash);
  return isValid;
}

export { hashPassword, verifyPassword };
