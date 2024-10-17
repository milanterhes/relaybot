import authOptions from "@/lib/auth-options";
import { getAccount, getMyProjects } from "@/lib/data-access";
import { getUsersGuilds } from "@/lib/discord";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const account = await getAccount(session.user.id);

  if (account.isErr()) {
    console.error(account.error);
    return new Response("Failed to fetch account", { status: 500 });
  }

  if (!account.value.access_token) {
    console.error("Access token not found for user", session.user.id);
    return new Response("Access token not found", { status: 500 });
  }

  const guilds = await getUsersGuilds(
    `Bearer ${account.value.access_token}`,
    session.user.id
  );

  if (guilds.isErr()) {
    console.error(guilds.error);
    return new Response("Failed to fetch guilds", { status: 500 });
  }

  const myProjects = await getMyProjects(session.user.id);

  if (myProjects.isErr()) {
    console.error(myProjects.error);
    return new Response("Failed to fetch projects", { status: 500 });
  }

  return new Response(JSON.stringify(myProjects.value), { status: 200 });
}
