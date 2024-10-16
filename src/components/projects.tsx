import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import authOptions from "@/lib/auth-options";
import { getUsersGuilds, Guild, makeIconUrl } from "@/lib/discord";
import { accounts, db, Project, projects } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { Plus } from "lucide-react";
import { getServerSession } from "next-auth";
import React, { PropsWithChildren } from "react";
import Image from "next/image";

const Projects = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <div>Please log in</div>;
  }

  const account = await db
    .select()
    .from(accounts)
    .where(eq(accounts.userId, session.user.id));

  if (!account || !account[0] || !account[0].access_token) {
    return <div>Please log in</div>;
  }

  const guilds = await getUsersGuilds(account[0].access_token);

  if (guilds.isErr()) {
    return <div>Failed to fetch guilds</div>;
  }

  console.log(guilds.value[0]);

  const myProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.ownerId, session.user.id));
  return (
    <div>
      <p>Projects</p>
      <div className="grid">
        <div className="w-56">
          <CreateProjectCard guilds={guilds.value} />
        </div>
        {myProjects.map((project) => (
          <div key={project.id} className="w-56">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  );
};

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{project.description}</CardDescription>
      </CardContent>
      <CardFooter>
        <CardDescription>{project.ownerId}</CardDescription>
      </CardFooter>
    </Card>
  );
};

const CreateProjectCard: React.FC<{ guilds: Guild[] }> = ({ guilds }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Project</CardTitle>
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

const CreateProjectDialog: React.FC<PropsWithChildren<{ guilds: Guild[] }>> = ({
  children,
  guilds, // TODO: fix prop drilling
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
          <DialogDescription>
            Create a new project and start scheduling messages
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" placeholder="My project" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="server" className="text-right">
              Server
            </Label>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select the server" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {guilds.map((guild) => (
                    <SelectItem key={guild.id} value={guild.id}>
                      <div className="flex items-center">
                        {guild.icon ? (
                          <Image
                            src={makeIconUrl(guild, 24)}
                            alt="Server icon"
                            width={24}
                            height={24}
                            className="rounded-full mr-2"
                          />
                        ) : null}
                        <p>{guild.name}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Projects;
