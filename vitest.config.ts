import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        isolate: true,
        coverage: {
            provider: "v8",
            include: ["src"],
            exclude: ["src/index.ts", "scripts", "node_modules", "dist"]
        }
    },
});
