import { hashBufferToArray } from "../hashBufferToArray/index.js";

/**
 * Hashes buffer to base36 using SHA-512.
 *
 * @param {BufferSource} buffer - Buffer to be hashed
 *
 * @return {Promise<string>} Promise that resolves with base36 string
 */
export const hashBufferToBase36 = async (
	buffer: BufferSource,
): Promise<string> => {
	const hashed = await hashBufferToArray(buffer);

	// append bytes to BigInt
	let bigint = BigInt(0);
	for (let i = 0; i < hashed.length; ++i) {
		bigint = (bigint << BigInt(8)) + BigInt(hashed[i]);
	}

	// return base36 converted from BigInt
	return bigint.toString(36);
};
