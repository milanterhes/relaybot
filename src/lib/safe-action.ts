import { getServerSession } from "next-auth";
import { createSafeActionClient } from "next-safe-action";
import authOptions from "./auth-options";

export const actionClient = createSafeActionClient({
  handleServerError: (error) => {
    console.error("Server error handler", error instanceof ActionError);
    if (error instanceof ActionError) {
      return error.message
    }
    return "An error occurred";
  }
}).use(async ({ next }) => {
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

export class ActionError extends Error {
  constructor(message: string) {
    super(message);
  }
}