import { allMappings } from './mappingsLoader';

const mappingRegistry = new Map();

/**
 * Registers mappings for a specific API.
 *
 * @param {string} apiName - The name of the API.
 * @param {Array} mappings - The mappings to register.
 */
export const registerMappings = (apiName, mappings) => {
	mappingRegistry.set(apiName, mappings);
};

/**
 * Retrieves mappings for a specific API.
 *
 * @param {string} apiName - The name of the API.
 * @returns {Array} - The registered mappings.
 */
export const getMappings = (apiName) => mappingRegistry.get(apiName);

// Automatically register all mappings
Object.entries(allMappings).forEach(([apiName, mappings]) => {
	registerMappings(apiName, mappings);
});
