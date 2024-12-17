import mappingsConfig from './mappings.json';

/**
 * Parses mappings from configuration files.
 *
 * @param {Object} config - The mapping configuration object.
 * @returns {Object} - Parsed mappings grouped by API name.
 */
export const parseMappings = (config) => {
	const { defaults, ...mappingsByApi } = config;

	return Object.entries(mappingsByApi).reduce((result, [apiName, mappings]) => {
		result[apiName] = mappings.map((mapping) => ({
			...mapping, // Include all properties in the mapping (sourceKey, targetKey, etc.)
			removeSourceKey: mapping.removeSourceKey || false, // Ensure default for optional keys
		}));
		return result;
	}, {});
};

/**
 * Parsed mappings for all APIs.
 */
export const allMappings = parseMappings(mappingsConfig);
