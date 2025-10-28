export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "₦0";
  return `₦${Number(amount).toLocaleString()}`;
};

// Safe value getter
export const getSafeValue = (value, fallback = 0) => {
  return value || fallback;
};
