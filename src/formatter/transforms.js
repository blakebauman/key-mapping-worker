// transforms.js
import { formatCurrency } from './currency';

/**
 * A collection of custom transformation functions.
 */
/**
 * An object containing custom transformation functions.
 *
 * @namespace customTransforms
 * @property {Function} formatCurrency - Formats a number as a currency string.
 * @property {Function} toUpperCase - Converts a string to uppercase.
 * @property {Function} formatDate - Formats a date string to a specified format.
 * @property {Function} replaceString - Replaces occurrences of a substring within a string.
 * @property {Function} removeSourceKey - Removes the source key entirely from the payload.
 */
export const customTransforms = {
	formatCurrency: (value, params) => {
		return () => formatCurrency(value, params.currencyCode, params.decimalPlaces);
	},
	toUpperCase: (value) => {
		return () => {
			if (typeof value !== 'string') {
				console.warn('toUpperCase: Value is not a string. Returning original value.');
				return value;
			}
			return value.toUpperCase();
		};
	},
	formatDate: (value, { dateFormat = 'YYYY-MM-DD' } = {}) => {
		return () => {
			const date = new Date(value);
			return date.toISOString().split('T')[0];
		};
	},
	/**
	 * Replaces occurrences of a specified string or regular expression within a value.
	 *
	 * @param {string} value - The original string to perform replacements on.
	 * @param {Object} [params] - Parameters for the replacement.
	 * @param {string|RegExp} [params.searchValue] - The string or regular expression to search for.
	 * @param {string} [params.replaceValue] - The string to replace the searchValue with.
	 * @returns {Function} A function that performs the replacement and returns the modified string.
	 */
	replaceString: (value, { searchValue, replaceValue }) => {
		return () => {
			if (typeof value !== 'string') return value;

			if (!searchValue || replaceValue === undefined) {
				console.warn("replaceString: Missing 'searchValue' or 'replaceValue'");
				return value;
			}

			const regex = new RegExp(searchValue, 'g');
			return value.replace(regex, replaceValue);
		};
	},
	/**
	 * Replaces occurrences of a specified string or regular expression within a value.
	 *
	 * @param {string} value - The original string to perform replacements on.
	 * @param {Object} [params] - Parameters for the replacement.
	 * @param {string|RegExp} [params.searchValue] - The string or regular expression to search for.
	 * @param {string} [params.replaceValue] - The string to replace the searchValue with.
	 * @returns {Function} A function that performs the replacement and returns the modified string.
	 */
	redactString: (value, { replaceValue = '{REDACTED}' }) => {
		return () => {
			if (typeof value !== 'string') {
				console.warn('replaceString: Value must be a string. Returning original value.');
				return value;
			}

			return replaceValue;
		};
	},
	/**
	 * A transformation function to indicate the source key should be removed.
	 * When this function is used, the framework assumes the sourceKey should be deleted
	 * entirely and ignores any targetKey assignment.
	 *
	 * @returns {Function} A function that signals the removal.
	 */
	removeSourceKey: () => {
		return (payload, parent, key) => {
			// Remove the key directly from its parent object
			return (payload, parent, key) => {
				if (parent && key in parent) {
					delete parent[key];
				}
			};
		};
	},
};
