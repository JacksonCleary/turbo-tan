import { z } from "zod";

export const userInputSchema = z.object({
	email: z.string().email("A valid email is required"),
	name: z.string().min(1, "Name is required"),
});

export type UserInput = z.infer<typeof userInputSchema>;
