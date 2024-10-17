import { eq } from "drizzle-orm";
import { ResultAsync } from "neverthrow";
import { accounts, db } from "../schema";

/**
 * Get an auth account by user ID
 * @param userId The user's ID
 * @returns The user's account
 */
export const getOneByUserId = async (userId: string) =>
    ResultAsync.fromPromise(
        db.select().from(accounts).where(eq(accounts.userId, userId)),
        (error) => new Error(`Failed to fetch account: ${error}`)
    ).map((account) => account[0]);