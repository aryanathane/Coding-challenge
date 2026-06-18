import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Creates a signed JWT embedding the user's id and role.
// This token is sent back to the client and must be included as
// "Authorization: Bearer <token>" on every subsequent protected request.
export function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}