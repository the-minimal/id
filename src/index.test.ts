import { expect, test } from "bun:test";
import { createId } from "./index.js";

const id16 = () => createId({ length: 16 });
const id32 = () => createId({ length: 32 });
const id64 = () => createId({ length: 64 });

test("createId", async () => {
	expect(await id16()).toHaveLength(16);
	expect(await id32()).toHaveLength(32);
	expect(await id64()).toHaveLength(64);
});
