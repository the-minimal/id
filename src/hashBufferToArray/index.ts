/**
 * Hashes buffer to Uint8Array using SHA-512
 *
 * @param {BufferSource} buffer - Buffer to be hashed
 *
 * @return {Promise<Uint8Array>} Promise that resolves with Uint8Array
 */
export const hashBufferToArray = async (
	buffer: BufferSource,
): Promise<Uint8Array> => {
	return new Uint8Array(await crypto.subtle.digest("SHA-512", buffer));
};
