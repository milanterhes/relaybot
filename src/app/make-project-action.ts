"use server";

import { authenticatedAction } from "@/lib/safe-action";
import { db, projects, ProjectValues } from "@/lib/schema";
import { ResultAsync } from "neverthrow";
import { z } from "zod";

const schema = z.object({
  name: z.string(),
  description: z.string(),
});

const createProject = (values: ProjectValues) =>
  ResultAsync.fromPromise(
    db.insert(projects).values(values),
    (error) => new Error(`Failed to create project: ${error}`)
  );

export const makeProject = authenticatedAction
  .schema(schema)
  .action(async ({ parsedInput: { description, name }, ctx }) => {
    const project = await createProject({
      name,
      description,
      ownerId: ctx.session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (project.isOk()) {
      return { success: "Project created" };
    }

    return { error: project.error.message };
  });
