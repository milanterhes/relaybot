"use server";

import { Button } from "@/components/ui/button";
import { getAccount, getMyProjects } from "@/lib/data-access";
import authOptions from "@/lib/auth-options";
import { getUsersGuilds } from "@/lib/discord";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { getServerSession } from "next-auth";
import CreateProjectDialog from "./create-project-form";
import ProjectsList from "./projects-list";

const Projects = async () => {
  const queryClient = new QueryClient();

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

  const guilds = await getUsersGuilds(
    `Bearer ${account.value.access_token}`,
    session.user.id
  );

  if (guilds.isErr()) {
    console.error(guilds.error);
    return <div>Failed to fetch guilds</div>;
  }

  const myProjects = await getMyProjects(session.user.id);

  if (myProjects.isErr()) {
    console.error(myProjects.error);
    return <div>Failed to fetch projects</div>;
  }

  await queryClient.prefetchQuery({
    queryKey: ["my-projects"],
    queryFn: async () => myProjects.value,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="py-2">
        <div className="flex justify-between mb-2">
          <p className="text-3xl font-bold">Projects</p>
          <CreateProjectDialog guilds={guilds.value}>
            <Button>
              <Plus className="mr-2 w-4 h-4" /> New Project
            </Button>
          </CreateProjectDialog>
        </div>
        <ProjectsList guilds={guilds.value} />
      </div>
    </HydrationBoundary>
  );
};

export default Projects;
