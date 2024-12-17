/**
 * An object representing the store configuration.
 *
 * @property {Object} Auth - The authentication object.
 * @property {Function} Auth.hasPermission - A function to check if a user has a specific permission.
 * @property {string} lang - The language setting of the store.
 * @property {string} region - The region setting of the store.
 */
const store = {
	Auth: {
		hasPermission: (permission) => {
			return true;
		},
	},
	lang: 'en',
	region: 'us',
};

/**
 * An object that maps currency codes to their respective country codes.
 *
 * @constant {Object.<string, string|string[]>} formatCurrencyMapping
 * @property {string} USD - Represents the United States currency code.
 * @property {string[]} CAD - Represents the Canadian currency code, with possible values "CD" and "CA".
 * @property {string} EUR - Represents the European Union currency code.
 */
export const formatCurrencyMapping = {
	USD: 'US',
	CAD: ['CD', 'CA'],
	EUR: 'EU',
};

/**
 * Finds the currency key corresponding to a given currency code.
 *
 * @param {string} code - The currency code to find the key for.
 * @returns {string|null} The currency key if found, otherwise the original code or null if the input is not a string.
 */
export function findCurrencyKey(code) {
	if (typeof code !== 'string') return null;
	for (const [key, value] of Object.entries(formatCurrencyMapping)) {
		if (Array.isArray(value) ? value.includes(code) : value === code) {
			return key;
		}
	}
	return code;
}

/**
 * Checks if the given currency code is valid.
 *
 * @param {string} code - The currency code to validate.
 * @returns {boolean} - Returns true if the currency code is valid, otherwise false.
 */
export function isValidCurrency(locale, code) {
	try {
		new Intl.NumberFormat(locale, { style: 'currency', currency: code });
		return true;
	} catch (e) {
		return false;
	}
}

/**
 * Formats a given amount into a currency string based on the specified currency and locale.
 *
 * @param {number|string} amount - The amount to be formatted.
 * @param {string} currency - The currency code (e.g., 'USD', 'EUR').
 * @param {number} [numberOfDigits=4] - The number of fractional digits to display.
 * @param {boolean} [checkAuth=true] - Whether to check for authorization before formatting.
 * @returns {string} The formatted currency string or "-" if authorization fails.
 */
export function formatCurrency(amount, currency, numberOfDigits = 4, checkAuth = true) {
	if (checkAuth && !store.Auth?.hasPermission('Wesco_Company::view_pricing')) {
		return '-';
	}

	// Default locale and currency
	const defaultLocale = 'en-US';
	const defaultCurrencyCode = 'USD';

	// Get the locale based on the store configuration
	const locale = `${store?.lang}-${store?.region?.toUpperCase()}` || defaultLocale; // Default to 'en-US' if locale is not defined, see defaultLocale

	// Check if the currency code is abbreviated (e.g., 'CA', 'CD') and find the corresponding key
	const currencyCode = findCurrencyKey(currency?.trim());

	// Adjust the currency code if invalid
	const adjustedCurrency = isValidCurrency(locale, currencyCode) ? currencyCode : defaultCurrencyCode; // Default to USD if invalid, see defaultCurrency

	// Get the custom display abbreviation for the currency
	const formatter = new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: adjustedCurrency,
		minimumFractionDigits: numberOfDigits,
	});

	// Format the amount and replace the currency symbol with the custom display
	const formatted = formatter
		.format(Number(amount))
		.replace(adjustedCurrency.substring(0, 2), adjustedCurrency.substring(0, 2).concat(' '));

	// Split the formatted string into dollars and cents
	let [dollars, cents] = formatted.split('.');

	// Remove trailing zeros from the cents
	if (cents) {
		while (cents.length > 2 && cents.endsWith('0')) {
			cents = cents.slice(0, -1);
		}
		return `${dollars}.${cents}`;
	}

	return formatted;
}

// const amount = 1234.5678;

// console.log('-------------------  V1 -------------------');

// // Example 1: US Dollar (USD) in the United States Locale
// console.log(formatCurrencyV1(amount, 'USD', 4, false));
// // Output: $1,234.5678

// // Example 2: Euro (EUR) in the German Locale
// console.log(formatCurrencyV1(amount, 'EUR', 4, false));
// // Output: 1.234,5678 €

// // Example 3: Japanese Yen (JPY) in the Japanese Locale
// console.log(formatCurrencyV1(amount, 'JPY', 4, false));
// // Output: ¥1,235

// //  Example 4: British Pound (GBP) in the UK Locale
// console.log(formatCurrencyV1(amount, 'GBP', 4, false));
// // Output: £1,234.5678

// // Example 5: Indian Rupee (INR) in the Indian Locale
// console.log(formatCurrencyV1(amount, 'INR', 4, false));
// // Output: ₹1,234.5678

// // Example 6: Canadian Dollar (CAD) in the Canadian Locale
// console.log(formatCurrencyV1(amount, 'CAD', 4, false));
// // Output: CA$1,234.5678

// //Example 7: Chinese Yuan (CNY) in the Chinese Locale
// console.log(formatCurrencyV1(amount, 'CNY', 4, false));
// // Output: ¥1,234.567

// // Example 8: Australian Dollar (AUD) in the Australian Locale
// console.log(formatCurrencyV1(amount, 'AUD', 4, false));
// // Output: A$1,234.5678

// // Example 9: Swiss Franc (CHF) in the Swiss Locale
// console.log(formatCurrencyV1(amount, 'CHF', 4, false));
// // Output: CHF 1,234.5678

// // Example 10: South African Rand (ZAR) in the South African Locale
// console.log(formatCurrencyV1(amount, 'ZAR', 4, false));
// // Output: R1,234.5678

// console.log('-------------------  V2 -------------------');

// // Example 1: US Dollar (USD) in the United States Locale
// console.log(formatCurrency(amount, 'USD', 4, false));
// // Output: $1,234.5678

// // Example 2: Euro (EUR) in the German Locale
// console.log(formatCurrency(amount, 'EUR', 4, false));
// // Output: 1.234,5678 €

// // Example 3: Japanese Yen (JPY) in the Japanese Locale
// console.log(formatCurrency(amount, 'JPY', 4, false));
// // Output: ¥1,235

// //  Example 4: British Pound (GBP) in the UK Locale
// console.log(formatCurrency(amount, 'GBP', 4, false));
// // Output: £1,234.5678

// // Example 5: Indian Rupee (INR) in the Indian Locale
// console.log(formatCurrency(amount, 'INR', 4, false));
// // Output: ₹1,234.5678

// // Example 6: Canadian Dollar (CAD) in the Canadian Locale
// console.log(formatCurrency(amount, 'CAD', 4, false));
// // Output: CA$1,234.5678

// //Example 7: Chinese Yuan (CNY) in the Chinese Locale
// console.log(formatCurrency(amount, 'CNY', 4, false));
// // Output: ¥1,234.567

// // Example 8: Australian Dollar (AUD) in the Australian Locale
// console.log(formatCurrency(amount, 'AUD', 4, false));
// // Output: A$1,234.5678

// // Example 9: Swiss Franc (CHF) in the Swiss Locale
// console.log(formatCurrency(amount, 'CHF', 4, false));
// // Output: CHF 1,234.5678

// // Example 10: South African Rand (ZAR) in the South African Locale
// console.log(formatCurrency(amount, 'ZAR', 4, false));
// // Output: R1,234.5678

// console.log('-------------------  NOTES -------------------');

// const parse = parseFloat(amount).toFixed(4);
// console.log(`parseFloat: ${parse}`);

// const parseNumber = Number(amount);
// console.log(`Number: ${parseNumber}`);
