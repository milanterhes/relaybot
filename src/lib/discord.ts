import { Result, ResultAsync } from "neverthrow";
import { z } from "zod";

const GuildSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().nullable(),
  owner: z.boolean(),
  banner: z.string().nullable(),
  permissions: z.number(),
  features: z.array(z.string()),
  permissions_new: z.string(),
});

export type Guild = z.infer<typeof GuildSchema>;

export const getUsersGuilds = async (token: string) =>
  ResultAsync.fromPromise(
    fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `${token}`,
      },
    }),
    (error) => new Error(`Failed to fetch user's guilds: ${error}`)
  )
    .andThen((response) =>
      ResultAsync.fromPromise(
        response.json(),
        (error) => new Error(`Failed to parse response: ${error}`)
      )
    )
    .andThen(
      Result.fromThrowable(
        (guilds) => z.array(GuildSchema).parse(guilds),
        (error) => new Error(`Failed to parse guilds: ${error}`)
      )
    );

export const makeIconUrl = (guild: Guild, size: number) =>
  `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=${size}`;
