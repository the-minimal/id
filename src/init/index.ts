import { createFingerPrint } from "@the-minimal/fingerprint";
import { asciiToArray } from "../asciiToArray/index.js";
import {
	BUFFER_SIZE,
	DEFAULT_LENGTH,
	EXTERNAL_END,
	EXTERNAL_SIZE,
	EXTERNAL_START,
	FINGERPRINT_SIZE,
	FINGERPRINT_START,
	SALT_END,
	SALT_START,
} from "../constants.js";
import { getRandomSlice } from "../getRandomSlice/index.js";
import { hashBufferToArray } from "../hashBufferToArray/index.js";
import { hashBufferToBase36 } from "../hashBufferToBase36/index.js";

let FINGERPRINT_ARRAY: Uint8Array;

/**
 * Initializes a new instance of ID generator.
 *
 * @param {Object} props - Optional properties to tweak ID generation
 * @param {string} props.length - Length of the returned ID (between 1 and 96)
 */
export const init = (
	props: {
		length?: number;
	} = {},
) => {
	props.length ??= DEFAULT_LENGTH;

	if (props.length > 96 || props.length < 1) {
		throw Error("Length has to be between 1 and 96");
	}

	const COUNTER = new Uint32Array(1);

	// seed counter with random value
	crypto.getRandomValues(COUNTER);

	return async (external = ""): Promise<string> => {
		if (FINGERPRINT_ARRAY === undefined) {
			FINGERPRINT_ARRAY = await hashBufferToArray(
				asciiToArray(createFingerPrint()),
			);
		}

		const buffer = new ArrayBuffer(BUFFER_SIZE);
		const array = new Uint8Array(buffer);
		const count = COUNTER[0]++;
		const timestamp = Date.now();

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

		// fill fingerprint slice with hash of fingerprint value
		array.set(
			getRandomSlice(FINGERPRINT_ARRAY, FINGERPRINT_SIZE),
			FINGERPRINT_START,
		);

		// fill external slice with random values
		if (external === "") {
			crypto.getRandomValues(array.subarray(EXTERNAL_START, EXTERNAL_END));
		}

		// fill external slice with hash of external value
		else {
			array.set(
				getRandomSlice(
					await hashBufferToArray(asciiToArray(external)),
					EXTERNAL_SIZE,
				),
				EXTERNAL_START,
			);
		}

		return getRandomSlice(
			await hashBufferToBase36(buffer),
			props.length as number,
		);
	};
};

/**
 * Creates a random ID.
 *
 * @param {string} external - External data to be hashed
 *
 * @return {Promise<string>} Promise that resolves with ID
 */
export const createId = init();
