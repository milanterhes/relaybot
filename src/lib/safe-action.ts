import { getServerSession } from "next-auth";
import { createSafeActionClient } from "next-safe-action";
import authOptions from "./auth-options";

export const actionClient = createSafeActionClient().use(async ({ next }) => {
  const startTime = performance.now();
  const result = await next();
  const endTime = performance.now();
  console.log("Action execution took", endTime - startTime, "ms");
  return result;
});

export const authenticatedAction = actionClient.use(async ({ next }) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }
  return next({ ctx: { session } });
});
