/**
 * Transforms string into Uint8Array.
 * It also asserts that string is ASCII.
 *
 * @param {string} value - Value to be transformed
 *
 * @return {Uint8Array} Array containing char codes of the input value
 */
export const asciiToArray = (value: string): Uint8Array => {
	const length = value.length;
	const buffer = new Uint8Array(length);

	for (let i = 0; i < length; ++i) {
		const code = value.charCodeAt(i);

		if (code > 0x7f) {
			throw Error("Value has to be ASCII string");
		}

		buffer[i] = code;
	}

	return buffer;
};
