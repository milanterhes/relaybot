"use server";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import authOptions from "@/lib/auth-options";
import { getUsersGuilds, Guild } from "@/lib/discord";
import { accounts, db, Project, projects } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { Plus } from "lucide-react";
import { getServerSession } from "next-auth";
import React from "react";
import CreateProjectDialog from "./create-project-form";
import { ResultAsync } from "neverthrow";

const getAccount = async (userId: string) => ResultAsync.fromPromise(
  db.select().from(accounts).where(eq(accounts.userId, userId)),
  (error) => new Error(`Failed to fetch account: ${error}`)
).map((account) => account[0]);

const getMyProjects = async (userId: string) => ResultAsync.fromPromise(
  db.select().from(projects).where(eq(projects.ownerId, userId)),
  (error) => new Error(`Failed to fetch projects: ${error}`)
);

const Projects = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <div>Please log in</div>;
  }

  const account = await getAccount(session.user.id);

  if (account.isErr()) {
    console.error(account.error);
    return <div>Failed to fetch account</div>;
  }

  if (!account.value.access_token) {
    console.error("Access token not found for user", session.user.id);
    return <div>Access token not found</div>;
  }

  const guilds = await getUsersGuilds(`Bearer ${account.value.access_token}`, session.user.id);

  if (guilds.isErr()) {
    console.error(guilds.error);
    return <div>Failed to fetch guilds</div>;
  }

  console.log('guilds', guilds.value);

  const myProjects = await getMyProjects(session.user.id);

  if (myProjects.isErr()) {
    console.error(myProjects.error);
    return <div>Failed to fetch projects</div>;
  }

  return (
    <div className="py-2">
      <div className="flex justify-between mb-2">
        <p className="text-3xl font-bold">Projects</p>
        <CreateProjectDialog guilds={guilds.value}>
          <Button>
            <Plus className="mr-2 w-4 h-4" /> New Project
          </Button>
        </CreateProjectDialog>
      </div>
      <div className="grid">
        {myProjects.value.length > 0 ? (
          myProjects.value.map((project) => (
            <div key={project.id} className="w-56">
              <ProjectCard project={project} guild={guilds.value.find((guild) => guild.id === project.serverId)} />
            </div>
          ))
        ) : (
          <div className="w-56">
            <CreateProjectCard guilds={guilds.value} />
          </div>
        )}
      </div>
    </div>
  );
};

const ProjectCard: React.FC<{ project: Project, guild?: Guild }> = ({ project, guild }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          <p>{project.description}</p>
          <p>{guild?.name}</p>
        </CardDescription>
      </CardContent>
    </Card>
  );
};

const CreateProjectCard: React.FC<{ guilds: Guild[] }> = ({ guilds }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>No projects</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          Create a new project and start scheduling messages
        </CardDescription>
      </CardContent>
      <CardFooter>
        <CreateProjectDialog guilds={guilds}>
          <Button className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Create
          </Button>
        </CreateProjectDialog>
      </CardFooter>
    </Card>
  );
};

export default Projects;
