export const CATEGORIES = [
  'Food & Dining','Transport','Shopping','Entertainment',
  'Health','Utilities','Travel','Education','Housing','Other',
];

export const CAT_COLORS = {
  'Food & Dining' : '#f25c5c',
  'Transport'     : '#4fc3f7',
  'Shopping'      : '#f5a623',
  'Entertainment' : '#a78bfa',
  'Health'        : '#22c97a',
  'Utilities'     : '#fb923c',
  'Travel'        : '#38bdf8',
  'Education'     : '#818cf8',
  'Housing'       : '#f472b6',
  'Other'         : '#9090a8',
};

export const CAT_ICONS = {
  'Food & Dining' : '🍔',
  'Transport'     : '🚗',
  'Shopping'      : '🛍️',
  'Entertainment' : '🎬',
  'Health'        : '💊',
  'Utilities'     : '💡',
  'Travel'        : '✈️',
  'Education'     : '📚',
  'Housing'       : '🏠',
  'Other'         : '📦',
};

export const formatCurrency = (amount = 0, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency', currency, maximumFractionDigits: 0,
  }).format(amount);

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

export const formatDateInput = (date) =>
  new Date(date).toISOString().slice(0, 10);

export const formatMonthYear = (str) => {
  const [y, m] = str.split('-');
  return new Date(+y, +m - 1).toLocaleString('default', { month: 'short', year: '2-digit' });
};

export const getInitials = (name = '') =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

export const downloadCSV = (csvText, filename = 'expenses.csv') => {
  const blob = new Blob([csvText], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};
