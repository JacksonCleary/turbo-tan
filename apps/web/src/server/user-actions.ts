import { db, users } from "@repo/db";
import { userInputSchema } from "@repo/validation";

export async function createUser(input: unknown) {
	const data = userInputSchema.parse(input);
	const [created] = await db.insert(users).values(data).returning();
	return created;
}
