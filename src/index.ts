declare const window: any;
declare const global: any;

const BUFFER_SIZE = 128;

const COUNT_SIZE = 4;
const TIMESTAMP_SIZE = 8;
const SALT_SIZE = 52;
const FINGERPRINT_SIZE = 32;
const EXTERNAL_SIZE = 32;

const SALT_START = COUNT_SIZE + TIMESTAMP_SIZE;
const SALT_END = SALT_START + SALT_SIZE;

const FINGERPRINT_START = SALT_END;
const FINGERPRINT_END = FINGERPRINT_START + FINGERPRINT_SIZE;

const EXTERNAL_START = FINGERPRINT_END;
const EXTERNAL_END = EXTERNAL_START + EXTERNAL_SIZE;

const DEFAULT_LENGTH = 32;

const counter = new Uint32Array(1);

// seed counter with random value
crypto.getRandomValues(counter);

/**
 * Hashes buffer to Uint8Array using SHA-512
 *
 * @param {BufferSource} buffer - Buffer to be hashed
 *
 * @return {Promise<Uint8Array>} Promise that resolves with Uint8Array
 */
const hashBufferToArray = async (buffer: BufferSource): Promise<Uint8Array> => {
	return new Uint8Array(await crypto.subtle.digest("SHA-512", buffer));
};

/**
 * Hashes buffer to base36 using SHA-512.
 *
 * @param {BufferSource} buffer - Buffer to be hashed
 *
 * @return {Promise<string>} Promise that resolves with base36 string
 */
const hashBufferToBase36 = async (buffer: BufferSource): Promise<string> => {
	const hashed = await hashBufferToArray(buffer);

	// append bytes to BigInt
	let bigint = BigInt(0);
	for (let i = 0; i < hashed.length; ++i) {
		bigint = (bigint << BigInt(8)) + BigInt(hashed[i]);
	}

	// return base36 converted from BigInt
	return bigint.toString(36);
};

/**
 * Transforms string into Uint8Array.
 * It also asserts that string is ASCII.
 *
 * @param {string} value - Value to be transformed
 *
 * @return {Uint8Array} Array containing char codes of the input value
 */
const asciiToArray = (value: string): Uint8Array => {
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

/**
 * Slices the original value at a random start position.
 *
 * @param {string | Uint8Array} value - Value to be sliced
 * @param {number} size - Desired size of the slice
 *
 * @return {string | Uint8Array} Sliced value
 */
const getRandomSlice = <$Value extends string | Uint8Array>(
	value: $Value,
	size: number,
): $Value => {
	const position = new Uint8Array(1);
	crypto.getRandomValues(position);

	const start = Math.round((position[0] / 255) * (value.length - size));

	return value.slice(start, start + size) as $Value;
};

/**
 * Creates a random ID.
 *
 * @param {Object} props - Optional properties to tweak ID generation
 * @param {string} props.length - Length of the returned ID (between 1 and 96)
 * @param {string} props.external - External (fingerprint) data to be hashed
 *
 * @return {Promise<string>} Promise that resolves with ID
 */
export const createId = async (
	props: {
		length?: number;
		external?: string;
	} = {},
): Promise<string> => {
	props.length ??= DEFAULT_LENGTH;
	props.external ??= "";

	if (props.length > 96 || props.length < 1) {
		throw Error("Length has to be between 1 and 96");
	}

	const buffer = new ArrayBuffer(BUFFER_SIZE);
	const array = new Uint8Array(buffer);
	const count = counter[0]++;
	const timestamp = Date.now();
	const fingerprint = createFingerprint();

	// set uint32 count
	array[0] = count & 0xff;
	array[1] = (count >> 8) & 0xff;
	array[2] = (count >> 16) & 0xff;
	array[3] = (count >> 24) & 0xff;

	// set uint64 timestamp
	array[4] = timestamp & 0xff;
	array[5] = (timestamp >> 8) & 0xff;
	array[6] = (timestamp >> 16) & 0xff;
	array[7] = (timestamp >> 24) & 0xff;
	array[8] = (timestamp >> 32) & 0xff;
	array[9] = (timestamp >> 40) & 0xff;
	array[10] = (timestamp >> 48) & 0xff;
	array[11] = (timestamp >> 56) & 0xff;

	// fill salt slice with random values
	crypto.getRandomValues(array.subarray(SALT_START, SALT_END));

	// fill fingerprint slice with random values
	if (fingerprint === "") {
		crypto.getRandomValues(array.subarray(FINGERPRINT_START, FINGERPRINT_END));
	}

	// fill fingerprint slice with hash of fingerprint value
	else {
		array.set(
			getRandomSlice(
				await hashBufferToArray(asciiToArray(fingerprint)),
				FINGERPRINT_SIZE,
			),
			FINGERPRINT_START,
		);
	}

	// fill external slice with random values
	if (props.external === "") {
		crypto.getRandomValues(array.subarray(EXTERNAL_START, EXTERNAL_END));
	}

	// fill external slice with hash of external value
	else {
		array.set(
			getRandomSlice(
				await hashBufferToArray(asciiToArray(props.external)),
				EXTERNAL_SIZE,
			),
			EXTERNAL_START,
		);
	}

	return getRandomSlice(await hashBufferToBase36(buffer), props.length);
};

/**
 * Creates a fingerprint based on the runtime's globals.
 *
 * @return {string} Concatenated array of keys of globals.
 */
export const createFingerprint = (): string => {
	return Object.keys(
		typeof global !== "undefined"
			? global
			: typeof window !== "undefined"
				? window
				: {},
	).join("");
};
