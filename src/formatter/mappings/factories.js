/**
 * Factory function to generate a mapping object for currency transformation.
 *
 * @param {string} sourceKey - The key of the source value to be transformed.
 * @param {string} targetKey - The key of the target value after transformation.
 * @param {string} [currencyCode='USD'] - The currency code to use for formatting.
 * @param {number} [decimalPlaces=2] - The number of decimal places to format the currency to.
 * @param {boolean} [removeSourceKey=false] - Whether to remove the source key from the result.
 * @returns {Object} The mapping object for currency transformation.
 */
export const createCurrencyMapping = (sourceKey, targetKey, currencyCode = 'USD', decimalPlaces = 2, removeSourceKey = false) => ({
	sourceKey,
	targetKey,
	transformFunction: 'formatCurrency',
	transformParams: { currencyCode, decimalPlaces },
	removeSourceKey,
});
