import applyKeyMappings from './formatter/applyKeyMappings';

// TODO: Implement process to ignore transforms and remove source keys
// TODO: Combine existing formatter with clean functions
// Review diff decimal numbers for display or calculation purposes
// - If its under a dollar then show four decimal places
//  - Over a dollar show 2

/**
 * Handles incoming fetch requests, processes the payload, and returns a transformed response.
 */
export default {
	async fetch(request, env, ctx) {
		try {
			const payload = await request.json();
			console.log('Received payload:', payload);
			const url = new URL(request.url);

			if (!payload) {
				return new Response(JSON.stringify({ error: 'Invalid request payload' }), {
					headers: { 'Content-Type': 'application/json' },
					status: 400,
				});
			}

			// Default transform parameters to use at runtime
			// Pull from ctx in worker implementation
			const defaultTransformParams = { locale: 'en-CA', currencyCode: 'CAD', decimalPlaces: 2 };
			// Custom parameters for specific transformations
			const customParams = {
				replaceString: [
					{ searchValue: 'Limited', replaceValue: 'Special' },
					{ searchValue: 'Time', replaceValue: 'Period' },
				],
			};

			let transformed;

			if (url.pathname === '/pricing') {
				transformed = await applyKeyMappings(payload, 'pricingApi', defaultTransformParams, customParams);
			} else if (url.pathname === '/order') {
				transformed = await applyKeyMappings(payload, 'orderDetailsApi', defaultTransformParams, customParams);
			} else if (url.pathname === '/checkout') {
				transformed = await applyKeyMappings(payload, 'checkoutDetailsApi', defaultTransformParams, customParams);
			}

			return new Response(JSON.stringify(transformed ?? [], null, 2), {
				headers: { 'Content-Type': 'application/json' },
			});
		} catch (error) {
			console.error('Failed to process request:', error.message, { error });
			return new Response(JSON.stringify({ error: 'Failed to process request', details: error.message }), {
				headers: { 'Content-Type': 'application/json' },
				status: 500,
			});
		}
	},
};
