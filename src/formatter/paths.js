// Dependencies: Map
const pathCache = new Map();

/**
 * Resolves the value of a nested key within an object, given a dot-separated path.
 * Supports array traversal using '[]' notation in the path.
 *
 * @param {Object} object - The object to resolve the nested key from.
 * @param {string} path - The dot-separated path string representing the nested key.
 * @returns {Array} - An array of resolved values for the nested key.
 */
export function resolveNestedKey(object, path) {
	if (!pathCache.has(path)) {
		const keys = path.split('.');
		pathCache.set(path, keys);
	}
	const keys = pathCache.get(path);

	let current = [object];
	for (const key of keys) {
		if (key.endsWith('[]')) {
			const baseKey = key.slice(0, -2);
			current = current.flatMap((item) => (item && item[baseKey] ? item[baseKey] : []));
		} else {
			current = current.map((item) => (item ? item[key] : undefined)).filter((item) => item !== undefined);
		}
	}
	return current;
}
