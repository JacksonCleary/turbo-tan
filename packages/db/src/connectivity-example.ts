import { sql } from "drizzle-orm";
import { db } from "./client.ts";

export async function checkDbConnectivity() {
	const result = await db.get<{ ok: number }>(sql`select 1 as ok`);
	return result?.ok === 1;
}
