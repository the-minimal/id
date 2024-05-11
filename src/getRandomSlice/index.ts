/**
 * Slices the original value at a random start position.
 *
 * @param {string | Uint8Array} value - Value to be sliced
 * @param {number} size - Desired size of the slice
 *
 * @return {string | Uint8Array} Sliced value
 */
export const getRandomSlice = <$Value extends string | Uint8Array>(
	value: $Value,
	size: number,
): $Value => {
	const position = new Uint8Array(1);
	crypto.getRandomValues(position);

	const start = Math.round((position[0] / 255) * (value.length - size));

	return value.slice(start, start + size) as $Value;
};
