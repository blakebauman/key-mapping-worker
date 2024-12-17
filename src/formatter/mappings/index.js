import { createCurrencyMapping } from './factories';
import { createKeyMappings } from '../index';

// Example usage
export const pricingApiKeyMappings = createKeyMappings(
	[
		createCurrencyMapping('data.products[].unitSellPrice', 'formattedUnitSellPrice', 'USD', 2, true),
		createCurrencyMapping('data.products[].customerUnitSellPrice', 'formattedCustomerUnitSellPrice', 'USD', 2, false),
		{
			sourceKey: 'data.products[].baseUom',
			targetKey: 'formattedBaseUom',
			transformFunction: 'toUpperCase',
			removeSourceKey: false,
		},
		{
			sourceKey: 'data.products[].priceUom',
			targetKey: 'formattedPriceUom',
			transformFunction: 'toUpperCase',
			removeSourceKey: true,
		},
		{
			sourceKey: 'data.products[].releaseDate',
			targetKey: 'formattedReleaseDate',
			transformFunction: 'formatDate',
			transformParams: { dateFormat: 'YYYY-MM-DD' },
			removeSourceKey: false,
		},
	],
	'en-US',
	'USD',
	4
);

// Example usage
export const orderDetailApiKeyMappings = createKeyMappings(
	[
		createCurrencyMapping('orders.items[].items[].product_sale_price.value', 'formattedProductSalePrice', 'CAD', 4, false),
		{
			sourceKey: 'orders.items[].items[].product_name',
			targetKey: 'upperCaseProductName',
			transformFunction: 'toUpperCase',
			removeSourceKey: false,
		},
		{
			sourceKey: 'orders.items[].customer_email',
			targetKey: 'formattedCustomerEmail',
			transformFunction: 'replaceString',
			transformParams: { searchValue: 'neelu.velpuri@wescodist.com', replaceValue: '-' },
			removeSourceKey: true,
		},
		{
			sourceKey: 'orders.items[].order_date',
			targetKey: 'formattedOrderDate',
			transformFunction: 'formatDate',
			transformParams: { dateFormat: 'YYYY-MM-DD' },
			removeSourceKey: false,
		},
	],
	'en-CA',
	'CAD',
	2
);
