import { getMappings } from './mappingsRegistry';
import { customTransforms } from './transforms'; // Your existing custom transforms
import { resolveNestedKey } from './paths'; // Your existing utility function

/**
 * Applies key mappings to the given payload object.
 *
 * @param {Object} payload - The object to which key mappings will be applied.
 * @param {string} apiName - The name of the API for which mappings are applied.
 * @param {Object} transformParams - Default transformation parameters (locale, currency, etc.).
 * @param {Object} customParams - Custom parameters for specific transformations.
 * @returns {Object} - The modified payload object with new attributes added based on the key mappings.
 */
async function applyKeyMappings(payload, apiName, transformParams = {}, customParams = {}) {
	const keyMappings = getMappings(apiName);

	if (!keyMappings) {
		// throw new Error(`No mappings found for API: ${apiName}`);
		console.warn(`No mappings found for API: ${apiName}`);
		// Gracefully return the original payload if no mappings are found
		return payload;
	}

	await Promise.all(
		keyMappings.map(async ({ sourceKey, targetKey, transformFunction, functionParams = {}, removeSourceKey = false }) => {
			// Combine default, mapping-specific, and custom parameters dynamically
			const combinedParams = {
				...transformParams,
				...functionParams,
				...(customParams[transformFunction] || {}),
			};

			// Resolve parent paths and values
			const parentPath = sourceKey.split('.').slice(0, -1).join('.');
			const parents = resolveNestedKey(payload, parentPath);
			const values = resolveNestedKey(payload, sourceKey);

			if (parents && values) {
				values.forEach((value, index) => {
					// Lazy transformation: Execute transformation only when needed
					const lazyTransformedValue =
						transformFunction && customTransforms[transformFunction]
							? customTransforms[transformFunction](value, combinedParams)
							: () => value;

					// Apply the transformation
					const transformedValue = lazyTransformedValue();

					if (removeSourceKey) {
						// Remove the original sourceKey entirely
						const sourceKeyParts = sourceKey.split('.');
						const lastKey = sourceKeyParts.pop();
						const parentObject = resolveNestedKey(payload, sourceKeyParts.join('.'))[index];

						if (parentObject && lastKey in parentObject) {
							delete parentObject[lastKey];
						}
					}

					if (transformedValue !== undefined) {
						// Assign transformed value to the target key
						parents[index][targetKey] = transformedValue;
					}
				});
			}
		})
	);

	return payload;
}

export default applyKeyMappings;
