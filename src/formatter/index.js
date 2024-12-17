import { applyMapping } from './apply';

/**
 * General function to create key mappings with custom transformations.
 *
 * @param {Object[]} mappings - Array of mapping objects.
 * @param {string} locale - Locale for formatting.
 * @param {string} currencyCode - Currency code for formatting.
 * @param {number} decimalPlaces - Number of decimal places for formatting.
 * @returns {Object[]} - Array of key mappings with transformations.
 */
export const createKeyMappings = (mappings, locale = 'en-US', currencyCode = 'USD', decimalPlaces = 4) =>
	mappings.map((mapping) => ({
		...mapping,
		transformParams: {
			...mapping.transformParams,
			locale: mapping.transformParams?.locale || locale,
			currencyCode: mapping.transformParams?.currencyCode || currencyCode,
			decimalPlaces: mapping.transformParams?.decimalPlaces || decimalPlaces,
		},
	}));

/**
 * Applies a series of key mappings to a given payload.
 *
 * @async
 * @function applyKeyMappings
 * @param {Object} payload - The data object to which the key mappings will be applied.
 * @param {Array<Object>} keyMappings - An array of key mapping objects that define how to transform the payload.
 * @returns {Promise<Object>} The transformed payload.
 * @throws Will throw an error if applying any of the key mappings fails.
 */
export async function applyKeyMappings(payload, keyMappings) {
	const startTime = performance.now();
	try {
		await Promise.all(keyMappings.map((mapping) => applyMapping(payload, mapping)));
	} catch (error) {
		console.error('Error applying key mappings:', error.message, { payload, keyMappings });
		throw error;
	} finally {
		const endTime = performance.now();
		console.log(`Key mappings applied in ${endTime - startTime}ms`);
	}
	return payload;
}
