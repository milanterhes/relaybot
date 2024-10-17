"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Guild } from "@/lib/discord";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import React from "react";
import { z } from "zod";
import CreateProjectDialog from "./create-project-form";
import { Project } from "@/lib/schema";
import Link from "next/link";

const ProjectsList: React.FC<{ guilds: Guild[] }> = ({ guilds }) => {
  const { data: myProjects } = useQuery({
    queryKey: ["my-projects"],
    queryFn: async () => {
      return fetch("/api/projects/me")
        .then((res) => res.json())
        .then((data) =>
          z
            .array(
              z.object({
                id: z.string(),
                name: z.string(),
                description: z.string(),
                serverId: z.string(),
                ownerId: z.string(),
                createdAt: z.string().transform((d) => new Date(d)),
                updatedAt: z.string().transform((d) => new Date(d)),
              })
            )
            .parse(data)
        );
    },
  });

  return (
    <div className="grid grid-cols-6 gap-2">
      {myProjects ? (
        myProjects.map((project) => (
          <Link key={project.id} href={`projects/${project.id}`}>
            <ProjectCard
              project={project}
              guild={guilds.find((guild) => guild.id === project.serverId)}
            />
          </Link>
        ))
      ) : (
        <div className="w-56">
          <CreateProjectCard guilds={guilds} />
        </div>
      )}
    </div>
  );
};

const ProjectCard: React.FC<{ project: Project; guild?: Guild }> = ({
  project,
  guild,
}) => {
  return (
    <Card className="hover:shadow-lg cursor-pointer hover:bg-secondary">
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{project.description}</CardDescription>
        <CardDescription>{guild?.name}</CardDescription>
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

export default ProjectsList;
