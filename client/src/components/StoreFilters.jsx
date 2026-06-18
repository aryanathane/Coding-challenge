function StoreFilters({ filters, onChange }) {
  function handleInputChange(e) {
    onChange({ ...filters, [e.target.name]: e.target.value });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
      <input
        type="text"
        name="name"
        value={filters.name}
        onChange={handleInputChange}
        placeholder="Filter by store name"
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
    </div>
  );
}

export default StoreFilters;