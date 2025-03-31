/**
 * Calculate the total price for an item including margin
 * @param {number} quantity - The quantity of items
 * @param {number} price - The price per unit
 * @param {number} margin - The margin percentage
 * @returns {number} The total price including margin
 */
export const calculateItemTotal = (quantity, price, margin) => {
  const baseTotal = quantity * price;
  const marginAmount = (baseTotal * margin) / 100;
  return baseTotal + marginAmount;
};

/**
 * Calculate the total for a section
 * @param {Array} items - Array of items in the section
 * @returns {number} The total price for the section
 */
export const calculateSectionTotal = (items) => {
  return items.reduce((total, item) => {
    return total + calculateItemTotal(item.quantity, item.price, item.margin);
  }, 0);
};

/**
 * Calculate the total for an estimation
 * @param {Array} sections - Array of sections in the estimation
 * @returns {number} The total price for the estimation
 */
export const calculateEstimationTotal = (sections) => {
  return sections.reduce((total, section) => {
    return total + calculateSectionTotal(section.items || []);
  }, 0);
};

/**
 * Format currency value
 * @param {number} value - The value to format
 * @param {string} locale - The locale to use for formatting
 * @param {string} currency - The currency code
 * @returns {string} The formatted currency string
 */
export const formatCurrency = (value, locale = 'en-US', currency = 'USD') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
}; 