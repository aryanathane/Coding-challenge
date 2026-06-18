import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import StarRating from '../components/StarRating';

function StoreListPage() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const fetchStores = useCallback(() => {
    api
      .get('/stores/browse', { params: { search } })
      .then((res) => setStores(res.data.stores))
      .catch(() => setError('Failed to load stores.'));
  }, [search]);

  
  useEffect(() => {
    const timer = setTimeout(fetchStores, 400);
    return () => clearTimeout(timer);
  }, [fetchStores]);

  async function handleRate(storeId, score) {
    try {
      await api.post('/ratings', { storeId, score });
      setStores((prev) =>
        prev.map((store) =>
          store.id === storeId ? { ...store, user_rating: score } : store
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-brand-dark mb-6">Browse Stores</h1>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by store name or address"
          className="w-full border border-gray-300 rounded-md px-4 py-2.5 mb-6 focus:outline-none focus:ring-2 focus:ring-brand-mid"
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3 mb-4">
            {error}
          </div>
        )}

        {stores.length === 0 ? (
          <p className="text-gray-400 text-center py-12">No stores found.</p>
        ) : (
          <div className="space-y-3">
            {stores.map((store) => (
              <div
                key={store.id}
                className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between gap-4"
              >
                <div>
                  <h2 className="font-semibold text-gray-800">{store.name}</h2>
                  <p className="text-sm text-gray-500">{store.address}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating value={Math.round(store.overall_rating)} readOnly />
                    <span className="text-xs text-gray-400">
                      ({store.overall_rating} overall)
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">
                    {store.user_rating ? 'Your rating' : 'Rate this store'}
                  </p>
                  <StarRating
                    value={store.user_rating}
                    onRate={(score) => handleRate(store.id, score)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StoreListPage;