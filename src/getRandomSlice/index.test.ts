import { describe, expect, it } from "vitest";
import { getRandomSlice } from "./index.js";

describe("getRandomSlice", () => {
	it("should return random slice from string", () => {
		const string = "abcdefghijklmnopqrstuvwxyz";
		const slice = getRandomSlice(string, 6);

		expect(slice).toHaveLength(6);

		const start = string.indexOf(slice[0]);

		for (let i = 0; i < 6; ++i) {
			expect(slice[i]).toBe(string[start + i]);
		}
	});

	it("should return random slice from Uint8Array", () => {
		const array = Uint8Array.from([
			1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
			22, 23, 24, 25, 26,
		]);
		const slice = getRandomSlice(array, 6);

		expect(slice).toHaveLength(6);

		const start = array.indexOf(slice[0]);

		for (let i = 0; i < 6; ++i) {
			expect(slice[i]).toBe(array[start + i]);
		}
	});
});
