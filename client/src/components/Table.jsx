
function Table({ columns, data, sortBy, order, onSortChange, renderCell, emptyMessage = 'No records found.' }) {
  function handleHeaderClick(columnKey) {
    if (sortBy === columnKey) {
      onSortChange(columnKey, order === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(columnKey, 'asc');
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm text-left">
        <thead className="bg-brand-dark text-white">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => col.sortable && handleHeaderClick(col.key)}
                className={`px-4 py-3 font-medium whitespace-nowrap ${
                  col.sortable ? 'cursor-pointer select-none hover:bg-brand-mid' : ''
                }`}
              >
                <span className="flex items-center gap-1">
                  {col.label}
                  {col.sortable && sortBy === col.key && (
                    <span>{order === 'asc' ? '▲' : '▼'}</span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={row.id || rowIndex} className="hover:bg-brand-pale/40">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 whitespace-nowrap">
                    {renderCell ? renderCell(row, col.key) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;