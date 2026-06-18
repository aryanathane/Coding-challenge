import pool from '../config/db.js';
import { hashPassword } from '../utils/hash.js';


export async function getDashboardStats(req, res) {
  try {
    const [usersCount, storesCount, ratingsCount] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query('SELECT COUNT(*) FROM stores'),
      pool.query('SELECT COUNT(*) FROM ratings'),
    ]);

    res.json({
      totalUsers: parseInt(usersCount.rows[0].count, 10),
      totalStores: parseInt(storesCount.rows[0].count, 10),
      totalRatings: parseInt(ratingsCount.rows[0].count, 10),
    });
  } catch (err) {
    console.error('Dashboard stats error:', err.message);
    res.status(500).json({ message: 'Failed to fetch dashboard stats.' });
  }
}

export async function createUser(req, res) {
  const { name, email, password, address, role } = req.body;

  const allowedRoles = ['admin', 'user', 'store_owner'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: `Role must be one of: ${allowedRoles.join(', ')}.` });
  }

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const passwordHash = await hashPassword(password);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, address, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, address, role, created_at`,
      [name, email, passwordHash, address || null, role]
    );

    res.status(201).json({ message: 'User created successfully.', user: result.rows[0] });
  } catch (err) {
    console.error('Create user error:', err.message);
    res.status(500).json({ message: 'Failed to create user.' });
  }
}

export async function getUsers(req, res) {
  const { name, email, address, role, sortBy = 'name', order = 'asc' } = req.query;

  const allowedSortColumns = ['name', 'email', 'address', 'role', 'created_at'];
  const sortColumn = allowedSortColumns.includes(sortBy) ? sortBy : 'name';
  const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  const conditions = [];
  const values = [];
  let paramIndex = 1;

  if (name) {
    conditions.push(`name ILIKE $${paramIndex++}`);
    values.push(`%${name}%`);
  }
  if (email) {
    conditions.push(`email ILIKE $${paramIndex++}`);
    values.push(`%${email}%`);
  }
  if (address) {
    conditions.push(`address ILIKE $${paramIndex++}`);
    values.push(`%${address}%`);
  }
  if (role) {
    conditions.push(`role = $${paramIndex++}`);
    values.push(role);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const query = `
      SELECT id, name, email, address, role, created_at
      FROM users
      ${whereClause}
      ORDER BY ${sortColumn} ${sortOrder}
    `;
    const result = await pool.query(query, values);
    res.json({ users: result.rows });
  } catch (err) {
    console.error('Get users error:', err.message);
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
}

export async function getUserById(req, res) {
  const { id } = req.params;

  try {
    const userResult = await pool.query(
      'SELECT id, name, email, address, role, created_at FROM users WHERE id = $1',
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = userResult.rows[0];

    if (user.role === 'store_owner') {
      const ratingResult = await pool.query(
        `SELECT COALESCE(AVG(r.score), 0) AS avg_rating
         FROM stores s
         LEFT JOIN ratings r ON r.store_id = s.id
         WHERE s.owner_id = $1`,
        [id]
      );
      user.rating = parseFloat(ratingResult.rows[0].avg_rating).toFixed(1);
    }

    res.json({ user });
  } catch (err) {
    console.error('Get user by id error:', err.message);
    res.status(500).json({ message: 'Failed to fetch user details.' });
  }
}