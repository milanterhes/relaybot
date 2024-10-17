import { err, errAsync, ok, okAsync, Result, ResultAsync } from "neverthrow";
import { z } from "zod";
import { redis } from "./redis";

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

const getUsersGuildsFromCache = (userId: string): ResultAsync<Guild[], Error> => {
  return ResultAsync.fromPromise(
    redis.get<Guild[]>(`user:${userId}:guilds`),
    (error) => new Error(`Failed to retrieve from cache: ${error}`)
  ).andThen((guilds) => {
    if (guilds !== null) {
      return okAsync(guilds);
    } else {
      return errAsync(new Error('Guilds not found in cache'));
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
    .andThen(
      Result.fromThrowable(
        (guilds) => z.array(GuildSchema).parse(guilds),
        (error) => new Error(`Failed to parse guilds: ${error}`)
      )
    );
};

export const getUsersGuilds = (token: string, userId: string): ResultAsync<Guild[], Error> => {
  return getUsersGuildsFromCache(userId).orElse(() =>
    getUsersGuildsRequest(token).andTee((guilds) =>
      ResultAsync.fromPromise(
        redis.set(`user:${userId}:guilds`, guilds),
        (error) => new Error(`Failed to update cache: ${error}`)
      )
    )
  );
};



export const makeIconUrl = (guild: Guild, size: number) =>
  `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=${size}`;
