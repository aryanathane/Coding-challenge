function StatsCards({ stats }) {
  const cards = [
    { label: 'Total Users', value: stats.totalUsers },
    { label: 'Total Stores', value: stats.totalStores },
    { label: 'Total Ratings', value: stats.totalRatings },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {cards.map((card) => (
        <div key={card.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">{card.label}</p>
          <p className="text-3xl font-bold text-brand-dark">{card.value ?? '—'}</p>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;