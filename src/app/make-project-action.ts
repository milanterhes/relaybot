"use server";

import { ActionError, authenticatedAction } from "@/lib/safe-action";
import { db, projects, ProjectValues } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { err, ResultAsync } from "neverthrow";
import { z } from "zod";

const schema = z.object({
  name: z.string(),
  description: z.string(),
  serverId: z.string(),
});

const findProjectByServerId = (serverId: string) =>
  ResultAsync.fromPromise(
    db.select().from(projects).where(eq(projects.serverId, serverId)),
    (error) => new Error(`Failed to find project by serverId: ${error}`)
  );

const createProject = (values: ProjectValues) =>
  findProjectByServerId(values.serverId).andThen((project) => {
    if (project.length > 0) {
      return err(new Error("Project for this server already exists"));
    }

    return ResultAsync.fromPromise(
      db.insert(projects).values(values),
      (error) => new Error(`Failed to create project: ${error}`)
    );
  });

export const makeProject = authenticatedAction
  .schema(schema)
  .action(async ({ parsedInput: { description, name, serverId }, ctx }) => {
    console.log("Creating project", { name, description, serverId });
    const project = await createProject({
      name,
      description,
      serverId,
      ownerId: ctx.session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (project.isOk()) {
      console.log("Project created", project.value);
      return { success: "Project created" };
    }

    console.error("Failed to create project", project.error);
    throw new ActionError("Failed to create project" + project.error.message); // TODO: format message so that it's user-friendly
  });
