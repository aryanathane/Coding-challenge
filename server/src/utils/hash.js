import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

// Hashes a plain-text password before storing it in the database.
export async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

// Compares a plain-text password (from login form) against the stored hash.
// Returns true if they match, false otherwise.
export async function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}