import { useState } from 'react';

function StarRating({ value, onRate, readOnly = false }) {
  const [hoverValue, setHoverValue] = useState(null);

  const displayValue = !readOnly && hoverValue !== null ? hoverValue : value || 0;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onRate && onRate(star)}
          onMouseEnter={() => !readOnly && setHoverValue(star)}
          onMouseLeave={() => !readOnly && setHoverValue(null)}
          className={`text-lg leading-none ${readOnly ? 'cursor-default' : 'cursor-pointer'} ${
            star <= displayValue ? 'text-brand-mid' : 'text-gray-300'
          }`}
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default StarRating;