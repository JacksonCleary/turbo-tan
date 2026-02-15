import { defineConfig } from "drizzle-kit";

const sqliteUrl = process.env["DATABASE_URL"] ?? "file:./local.db";

export default defineConfig({
	dbCredentials: {
		url: sqliteUrl,
	},
	dialect: "sqlite",
	out: "./drizzle",
	schema: "./src/schema.ts",
});
