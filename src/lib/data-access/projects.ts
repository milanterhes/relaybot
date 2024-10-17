import { eq } from "drizzle-orm";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { db, projects } from "../schema";
/**
   * Get a project by ID
   * @param id The project's ID
   * @returns The project
*/
export const getOneById = async (id: string) =>
    ResultAsync.fromPromise(
        db.select().from(projects).where(eq(projects.id, id)),
        (error) => new Error(`Failed to fetch project: ${error}`)
    ).andThen((projects) => {
        if (projects.length === 0) {
            return errAsync(new Error(`Project not found`));
        }
        return okAsync(projects[0]);
    })

/**
 * Get all projects by user ID
 * @param userId The user's ID
 * @returns The user's projects
 */
export const getAllByUserId = async (userId: string) =>
    ResultAsync.fromPromise(
        db.select().from(projects).where(eq(projects.ownerId, userId)),
        (error) => new Error(`Failed to fetch projects: ${error}`)
    );