/**
 * @param {number} macro
 * @param {number} serving_size
 * @param {number} consumed_serving_size
 */
export function getMacroProportionateToPortion(macro, serving_size, consumed_serving_size) {
	return Math.ceil(macro * (serving_size / consumed_serving_size));
}
