
function UserFilters({ filters, onChange }) {
  function handleInputChange(e) {
    onChange({ ...filters, [e.target.name]: e.target.value });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
      <input
        type="text"
        name="name"
        value={filters.name}
        onChange={handleInputChange}
        placeholder="Filter by name"
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid"
      />
      <input
        type="text"
        name="email"
        value={filters.email}
        onChange={handleInputChange}
        placeholder="Filter by email"
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid"
      />
      <input
        type="text"
        name="address"
        value={filters.address}
        onChange={handleInputChange}
        placeholder="Filter by address"
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid"
      />
      <select
        name="role"
        value={filters.role}
        onChange={handleInputChange}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid"
      >
        <option value="">All roles</option>
        <option value="admin">Admin</option>
        <option value="user">Normal User</option>
        <option value="store_owner">Store Owner</option>
      </select>
    </div>
  );
}

export default UserFilters;