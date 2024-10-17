import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { z } from "zod";
import { redis } from "./redis";

export const GuildSchema = z.object({
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

const getUsersGuildsFromCache = (
  userId: string
): ResultAsync<Guild[], Error> => {
  return ResultAsync.fromPromise(
    redis.get<Guild[]>(`user:${userId}:guilds`),
    (error) => new Error(`Failed to retrieve from cache: ${error}`)
  ).andThen((guilds) => {
    if (guilds !== null) {
      console.log("Guilds found in cache");
      return okAsync(guilds);
    } else {
      return errAsync(new Error("Guilds not found in cache"));
    }
  });
};

const getUsersGuildsRequest = (token: string): ResultAsync<Guild[], Error> => {
  return ResultAsync.fromPromise(
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
    .andThen((guilds) => {
      const result = z.array(GuildSchema).safeParse(guilds);
      if (result.success) {
        console.log("Guilds fetched from Discord");
        return okAsync(result.data);
      } else {
        return errAsync(new Error(result.error.errors.join(", ")));
      }
    });
};

export const getUsersGuilds = (
  token: string,
  userId: string
): ResultAsync<Guild[], Error> => {
  return getUsersGuildsFromCache(userId).orElse(() =>
    getUsersGuildsRequest(token).andTee((guilds) =>
      ResultAsync.fromPromise(
        redis.set(`user:${userId}:guilds`, guilds, { ex: 50 }),
        (error) => new Error(`Failed to update cache: ${error}`)
      )
    )
  );
};

export const makeIconUrl = (guild: Guild, size: number) =>
  `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=${size}`;
