import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import StatsCards from '../components/StatsCards';
import Table from '../components/Table';
import UserFilters from '../components/UserFilters';
import StoreFilters from '../components/StoreFilters';
import CreateUserForm from '../components/CreateUserForm';
import CreateStoreForm from '../components/CreateStoreForm';

const USER_COLUMNS = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'address', label: 'Address', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
];

const STORE_COLUMNS = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'address', label: 'Address', sortable: true },
  { key: 'rating', label: 'Rating', sortable: true },
];

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users'); 
  const [stats, setStats] = useState({});

  const [users, setUsers] = useState([]);
  const [userFilters, setUserFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [userSort, setUserSort] = useState({ sortBy: 'name', order: 'asc' });
  const [showCreateUser, setShowCreateUser] = useState(false);

  const [stores, setStores] = useState([]);
  const [storeFilters, setStoreFilters] = useState({ name: '', email: '', address: '' });
  const [storeSort, setStoreSort] = useState({ sortBy: 'name', order: 'asc' });
  const [showCreateStore, setShowCreateStore] = useState(false);

  useEffect(() => {
    api.get('/users/dashboard-stats').then((res) => setStats(res.data)).catch(() => {});
  }, []);

  
  const fetchUsers = useCallback(() => {
    const params = { ...userFilters, ...userSort };
    api.get('/users', { params }).then((res) => setUsers(res.data.users)).catch(() => {});
  }, [userFilters, userSort]);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
  }, [activeTab, fetchUsers]);

  
  const fetchStores = useCallback(() => {
    const params = { ...storeFilters, ...storeSort };
    api.get('/stores', { params }).then((res) => setStores(res.data.stores)).catch(() => {});
  }, [storeFilters, storeSort]);

  useEffect(() => {
    if (activeTab === 'stores') fetchStores();
  }, [activeTab, fetchStores]);

  function refreshStats() {
    api.get('/users/dashboard-stats').then((res) => setStats(res.data)).catch(() => {});
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-brand-dark mb-6">Admin Dashboard</h1>

        <StatsCards stats={stats} />

        {/* Tab switcher */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {['users', 'stores'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-brand-dark text-brand-dark'
                  : 'border-transparent text-gray-500 hover:text-brand-mid'
              }`}
            >
              {tab === 'users' ? 'Users' : 'Stores'}
            </button>
          ))}
        </div>

        {activeTab === 'users' ? (
          <>
            <div className="flex items-center justify-between mb-2">
              <UserFilters filters={userFilters} onChange={setUserFilters} />
            </div>
            <div className="flex justify-end mb-3">
              <button
                onClick={() => setShowCreateUser(true)}
                className="bg-brand-dark hover:bg-brand-mid text-white text-sm font-medium rounded-md px-4 py-2 transition-colors"
              >
                + Add User
              </button>
            </div>

            <Table
              columns={USER_COLUMNS}
              data={users}
              sortBy={userSort.sortBy}
              order={userSort.order}
              onSortChange={(sortBy, order) => setUserSort({ sortBy, order })}
              emptyMessage="No users found."
            />
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <StoreFilters filters={storeFilters} onChange={setStoreFilters} />
            </div>
            <div className="flex justify-end mb-3">
              <button
                onClick={() => setShowCreateStore(true)}
                className="bg-brand-dark hover:bg-brand-mid text-white text-sm font-medium rounded-md px-4 py-2 transition-colors"
              >
                + Add Store
              </button>
            </div>

            <Table
              columns={STORE_COLUMNS}
              data={stores}
              sortBy={storeSort.sortBy}
              order={storeSort.order}
              onSortChange={(sortBy, order) => setStoreSort({ sortBy, order })}
              emptyMessage="No stores found."
            />
          </>
        )}
      </div>

      {showCreateUser && (
        <CreateUserForm
          onCancel={() => setShowCreateUser(false)}
          onCreated={() => {
            setShowCreateUser(false);
            fetchUsers();
            refreshStats();
          }}
        />
      )}

      {showCreateStore && (
        <CreateStoreForm
          onCancel={() => setShowCreateStore(false)}
          onCreated={() => {
            setShowCreateStore(false);
            fetchStores();
            refreshStats();
          }}
        />
      )}
    </div>
  );
}

export default AdminDashboard;