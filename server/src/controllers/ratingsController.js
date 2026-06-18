import pool from '../config/db.js';

export async function submitRating(req, res) {
  const { storeId, score } = req.body;
  const userId = req.user.id;

  try {
    const storeCheck = await pool.query('SELECT id FROM stores WHERE id = $1', [storeId]);
    if (storeCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Store not found.' });
    }

    const result = await pool.query(
      `INSERT INTO ratings (store_id, user_id, score)
       VALUES ($1, $2, $3)
       ON CONFLICT (store_id, user_id)
       DO UPDATE SET score = EXCLUDED.score, updated_at = NOW()
       RETURNING id, store_id, user_id, score, created_at, updated_at`,
      [storeId, userId, score]
    );

    res.status(200).json({
      message: 'Rating submitted successfully.',
      rating: result.rows[0],
    });
  } catch (err) {
    console.error('Submit rating error:', err.message);
    res.status(500).json({ message: 'Failed to submit rating.' });
  }
}

export async function deleteRating(req, res) {
  const { storeId } = req.params;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'DELETE FROM ratings WHERE store_id = $1 AND user_id = $2 RETURNING id',
      [storeId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'You have not rated this store.' });
    }

    res.json({ message: 'Rating removed.' });
  } catch (err) {
    console.error('Delete rating error:', err.message);
    res.status(500).json({ message: 'Failed to remove rating.' });
  }
}