import { describe, expect, it } from "vitest";
import { asciiToArray } from "./index.js";

describe("asciiToArray", () => {
	it("should convert ASCII string to Uint8Array", () => {
		expect(asciiToArray("hello")).toEqual(
			Uint8Array.from([104, 101, 108, 108, 111]),
		);
	});

	it("should throw if string is not valid ASCII", () => {
		expect(() => asciiToArray("你好")).toThrow();
	});
});
