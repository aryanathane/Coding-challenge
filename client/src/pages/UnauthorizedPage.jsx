import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function UnauthorizedPage() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-pale px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-brand-dark mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-6">
          You don't have permission to view this page.
        </p>
        <Link
          to="/login"
          onClick={logout}
          className="inline-block bg-brand-dark hover:bg-brand-mid text-white font-medium rounded-md px-5 py-2.5 transition-colors"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default UnauthorizedPage;