import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import StarRating from '../components/StarRating';

function StoreOwnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/stores/my-store')
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load store data.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-brand-dark mb-6">My Store Dashboard</h1>

        {loading && <p className="text-gray-400">Loading...</p>}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-4">
            {error}
          </div>
        )}

        {data && (
          <>
            {/* Store info + average rating card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800">{data.store.name}</h2>
              <p className="text-sm text-gray-500 mb-3">{data.store.address}</p>

              <div className="flex items-center gap-3">
                <StarRating value={Math.round(data.averageRating)} readOnly />
                <span className="text-2xl font-bold text-brand-dark">{data.averageRating}</span>
                <span className="text-sm text-gray-400">
                  average from {data.raters.length} rating{data.raters.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>

            {/* Raters list */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-brand-dark text-white px-5 py-3 font-medium">
                Users who rated your store
              </div>

              {data.raters.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No ratings yet.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {data.raters.map((rater) => (
                    <div key={rater.id} className="flex items-center justify-between px-5 py-3">
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{rater.name}</p>
                        <p className="text-xs text-gray-500">{rater.email}</p>
                      </div>
                      <StarRating value={rater.score} readOnly />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StoreOwnerDashboard;