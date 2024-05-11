import { describe, expect, it } from "vitest";
import { hashBufferToBase36 } from "./index.js";

describe("hashBufferToBase36", () => {
	it("should hash BufferSource to Base36", async () => {
		expect(
			await hashBufferToBase36(Uint8Array.from([104, 101, 108, 108, 111])),
		).toBe(
			"opx46l6bobogoghc7ym8wqtjw4ef6kvy1gu0i2tiatlhl6wfm5jj1wxb2ut8oeie2s35yqj08zqjmc1o945mstusp7rlzl4aber",
		);
	});
});
