import { eq } from "drizzle-orm";
import { ResultAsync } from "neverthrow";
import { db, accounts, projects } from "./schema";

export const getAccount = async (userId: string) =>
  ResultAsync.fromPromise(
    db.select().from(accounts).where(eq(accounts.userId, userId)),
    (error) => new Error(`Failed to fetch account: ${error}`)
  ).map((account) => account[0]);

export const getMyProjects = async (userId: string) =>
  ResultAsync.fromPromise(
    db.select().from(projects).where(eq(projects.ownerId, userId)),
    (error) => new Error(`Failed to fetch projects: ${error}`)
  );
