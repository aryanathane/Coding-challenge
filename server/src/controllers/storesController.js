import pool from '../config/db.js';

export async function createStore(req, res) {
  const { name, email, address, ownerId } = req.body;

  try {
    const existing = await pool.query('SELECT id FROM stores WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'A store with this email already exists.' });
    }

    
    if (ownerId) {
      const ownerCheck = await pool.query(
        "SELECT id FROM users WHERE id = $1 AND role = 'store_owner'",
        [ownerId]
      );
      if (ownerCheck.rows.length === 0) {
        return res.status(400).json({ message: 'ownerId must refer to an existing store_owner user.' });
      }
    }

    const result = await pool.query(
      `INSERT INTO stores (name, email, address, owner_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, address, owner_id, created_at`,
      [name, email, address || null, ownerId || null]
    );

    res.status(201).json({ message: 'Store created successfully.', store: result.rows[0] });
  } catch (err) {
    console.error('Create store error:', err.message);
    res.status(500).json({ message: 'Failed to create store.' });
  }
}


export async function getStoresAdmin(req, res) {
  const { name, email, address, sortBy = 'name', order = 'asc' } = req.query;

  const allowedSortColumns = ['name', 'email', 'address', 'rating', 'created_at'];
  const sortColumn = allowedSortColumns.includes(sortBy) ? sortBy : 'name';
  const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  const conditions = [];
  const values = [];
  let paramIndex = 1;

  if (name) {
    conditions.push(`s.name ILIKE $${paramIndex++}`);
    values.push(`%${name}%`);
  }
  if (email) {
    conditions.push(`s.email ILIKE $${paramIndex++}`);
    values.push(`%${email}%`);
  }
  if (address) {
    conditions.push(`s.address ILIKE $${paramIndex++}`);
    values.push(`%${address}%`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  
  const orderClause = sortColumn === 'rating' ? 'rating' : `s.${sortColumn}`;

  try {
    const query = `
      SELECT
        s.id, s.name, s.email, s.address, s.created_at,
        COALESCE(AVG(r.score), 0)::float AS rating,
        COUNT(r.id) AS rating_count
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      ${whereClause}
      GROUP BY s.id
      ORDER BY ${orderClause} ${sortOrder}
    `;
    const result = await pool.query(query, values);

    const stores = result.rows.map((row) => ({
      ...row,
      rating: parseFloat(row.rating).toFixed(1),
    }));

    res.json({ stores });
  } catch (err) {
    console.error('Get stores (admin) error:', err.message);
    res.status(500).json({ message: 'Failed to fetch stores.' });
  }
}


export async function browseStores(req, res) {
  const { search = '' } = req.query;
  const userId = req.user.id;

  try {
    const query = `
      SELECT
        s.id, s.name, s.address,
        COALESCE(AVG(r.score), 0)::float AS overall_rating,
        ur.score AS user_rating
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      LEFT JOIN ratings ur ON ur.store_id = s.id AND ur.user_id = $1
      WHERE s.name ILIKE $2 OR s.address ILIKE $2
      GROUP BY s.id, ur.score
      ORDER BY s.name ASC
    `;
    const result = await pool.query(query, [userId, `%${search}%`]);

    const stores = result.rows.map((row) => ({
      ...row,
      overall_rating: parseFloat(row.overall_rating).toFixed(1),
      user_rating: row.user_rating || null,
    }));

    res.json({ stores });
  } catch (err) {
    console.error('Browse stores error:', err.message);
    res.status(500).json({ message: 'Failed to fetch stores.' });
  }
}

export async function getMyStore(req, res) {
  const ownerId = req.user.id;

  try {
    const storeResult = await pool.query('SELECT id, name, email, address FROM stores WHERE owner_id = $1', [ownerId]);

    if (storeResult.rows.length === 0) {
      return res.status(404).json({ message: 'No store is associated with this account.' });
    }

    const store = storeResult.rows[0];

    const avgResult = await pool.query(
      'SELECT COALESCE(AVG(score), 0)::float AS avg_rating FROM ratings WHERE store_id = $1',
      [store.id]
    );

    const ratersResult = await pool.query(
      `SELECT u.id, u.name, u.email, r.score, r.created_at
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id = $1
       ORDER BY r.created_at DESC`,
      [store.id]
    );

    res.json({
      store,
      averageRating: parseFloat(avgResult.rows[0].avg_rating).toFixed(1),
      raters: ratersResult.rows,
    });
  } catch (err) {
    console.error('Get my store error:', err.message);
    res.status(500).json({ message: 'Failed to fetch store dashboard.' });
  }
}