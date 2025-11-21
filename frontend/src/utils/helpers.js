export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const searchFilter = (items, searchTerm, fields) => {
  if (!searchTerm.trim()) return items;
  const query = searchTerm.toLowerCase();
  return items.filter(item =>
    fields.some(field => (item[field] || '').toLowerCase().includes(query))
  );
};