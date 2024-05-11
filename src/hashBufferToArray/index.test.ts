import { describe, expect, it } from "vitest";
import { hashBufferToArray } from "./index.js";

describe("hashBufferToArray", () => {
	it("should hash BufferSource to Uint8Array", async () => {
		expect(
			await hashBufferToArray(Uint8Array.from([104, 101, 108, 108, 111])),
		).toEqual(
			Uint8Array.from([
				155, 113, 210, 36, 189, 98, 243, 120, 93, 150, 212, 106, 211, 234, 61,
				115, 49, 155, 251, 194, 137, 12, 170, 218, 226, 223, 247, 37, 25, 103,
				60, 167, 35, 35, 195, 217, 155, 165, 193, 29, 124, 122, 204, 110, 20,
				184, 197, 218, 12, 70, 99, 71, 92, 46, 92, 58, 222, 244, 111, 115, 188,
				222, 192, 67,
			]),
		);
	});
});
