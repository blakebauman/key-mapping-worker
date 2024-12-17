// transforms.js
import { formatCurrency } from './currency';

/**
 * A collection of custom transformation functions.
 */
export const customTransforms = {
	formatCurrency: (value, params) => {
		return () => formatCurrency(value, params.currencyCode, params.decimalPlaces);
	},
	toUpperCase: (value) => {
		return () => value.toUpperCase();
	},
	formatDate: (value, { dateFormat = 'YYYY-MM-DD' } = {}) => {
		return () => {
			const date = new Date(value);
			return date.toISOString().split('T')[0];
		};
	},
	replaceString: (value, { searchValue, replaceValue } = {}) => {
		return () => {
			if (!searchValue || !replaceValue) {
				console.warn("replaceString: Missing 'searchValue' or 'replaceValue'.");
				return value; // Return the original value if parameters are missing
			}

			// Ensure searchValue is a string or a valid regular expression
			const regex = new RegExp(searchValue, 'g');
			return value.replace(regex, replaceValue);
		};
	},
	/**
	 * A transformation function to remove the source key entirely from the payload.
	 *
	 * @param {Object} value - The value to remove (not used here).
	 * @param {Object} params - Additional parameters (optional, for extensibility).
	 * @returns {Function} A function that returns undefined, signifying removal.
	 */
	removeSourceKey: (value, params = {}) => {
		return () => undefined; // No value returned, ensuring key is removed.
	},
};
