// apply.js
import { resolveNestedKey } from './paths';
import { customTransforms } from './transforms';

/**
 * Applies a mapping transformation to the given payload.
 *
 * @param {Object} payload - The input data object to be transformed.
 * @param {Object} mapping - The mapping configuration object.
 * @param {string} mapping.sourceKey - The key in the payload to be transformed.
 * @param {string} mapping.targetKey - The key in the payload where the transformed value will be assigned.
 * @param {string} [mapping.transformFunction] - The name of the custom transform function to apply.
 * @param {Object} [mapping.transformParams] - Parameters to pass to the custom transform function.
 * @param {boolean} [mapping.removeSourceKey=false] - Whether to remove the source key from the payload after transformation.
 * @returns {Promise<void>} A promise that resolves when the transformation is complete.
 */
export async function applyMapping(payload, mapping) {
	const { sourceKey, targetKey, transformFunction, transformParams, removeSourceKey } = mapping;
	const sourceKeyParts = sourceKey.split('.');
	const parentPath = sourceKeyParts.slice(0, -1).join('.');
	const lastKey = sourceKeyParts[sourceKeyParts.length - 1];
	const parents = parentPath ? resolveNestedKey(payload, parentPath) : [payload];
	const values = resolveNestedKey(payload, sourceKey);

	if (parents && values) {
		values.forEach((value, index) => {
			const lazyTransformedValue =
				transformFunction && customTransforms[transformFunction]
					? customTransforms[transformFunction](value, transformParams)
					: () => value;

			parents[index][targetKey] = lazyTransformedValue();

			if (removeSourceKey) {
				parents[index] = Object.keys(parents[index])
					.filter((key) => key !== lastKey)
					.reduce((newObj, key) => {
						newObj[key] = parents[index][key];
						return newObj;
					}, {});
			}
		});
	}
}
