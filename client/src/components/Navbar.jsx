import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_LINKS = {
  admin: [{ to: '/admin', label: 'Dashboard' }],
  user: [{ to: '/stores', label: 'Stores' }],
  store_owner: [{ to: '/my-store', label: 'My Store' }],
};

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const links = user ? ROLE_LINKS[user.role] || [] : [];

  return (
    <nav className="bg-brand-dark text-white px-6 py-4 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-8">
        <span className="font-bold text-lg">StoreRate</span>

        <div className="flex gap-4">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-white/90 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/change-password"
            className="text-sm font-medium text-white/90 hover:text-white transition-colors"
          >
            Change Password
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user && <span className="text-sm text-white/80">{user.name}</span>}
        <button
          onClick={handleLogout}
          className="bg-brand-light hover:bg-brand-mid text-sm font-medium rounded-md px-4 py-1.5 transition-colors"
        >
          Log Out
        </button>
      </div>
    </nav>
  );
}

export default Navbar;