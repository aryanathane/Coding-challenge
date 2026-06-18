import { useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setGeneralError('');
    setFieldErrors({});
    setSuccess('');

    
    if (newPassword !== confirmPassword) {
      setGeneralError('New password and confirmation do not match.');
      return;
    }

    setLoading(true);
    try {
      await api.put('/auth/change-password', { currentPassword, newPassword });
      setSuccess('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const errorMap = {};
        data.errors.forEach((e) => {
          
          errorMap[e.field] = e.message;
        });
        setFieldErrors(errorMap);
      } else {
        setGeneralError(data?.message || 'Failed to change password.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-md mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-brand-dark mb-6">Change Password</h1>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-md p-3 mb-4">
              {success}
            </div>
          )}
          {generalError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3 mb-4">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-mid"
              />
              {fieldErrors.currentPassword && (
                <p className="text-red-600 text-xs mt-1">{fieldErrors.currentPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="8-16 chars, 1 uppercase, 1 special char"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-mid"
              />
              {fieldErrors.newPassword && (
                <p className="text-red-600 text-xs mt-1">{fieldErrors.newPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-mid"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-dark hover:bg-brand-mid text-white font-medium rounded-md py-2.5 transition-colors disabled:opacity-60"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordPage;