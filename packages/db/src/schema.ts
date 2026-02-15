import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
	createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
	email: text("email").notNull().unique(),
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
});
