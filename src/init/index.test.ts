import { describe, expect, it } from "vitest";
import { createId, init } from "./index.js";

describe("init", () => {
	it("should create new ID generator and generate IDs of variable length", async () => {
		const generate1 = init({ length: 1 });
		const generate24 = createId;
		const generate32 = init({ length: 32 });
		const generate96 = init({ length: 96 });

		expect(generate1).toBeTypeOf("function");
		expect(generate24).toBeTypeOf("function");
		expect(generate32).toBeTypeOf("function");
		expect(generate96).toBeTypeOf("function");

		expect(await generate1("hello")).toHaveLength(1);
		expect(await generate24()).toHaveLength(24);
		expect(await generate32("world")).toHaveLength(32);
		expect(await generate96()).toHaveLength(96);
	});

	it("should throw if length is out of bounds", () => {
		expect(() => init({ length: 0 })).toThrow();
		expect(() => init({ length: 97 })).toThrow();
	});
});
