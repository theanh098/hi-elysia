import { Effect } from "effect";
import type { Redis } from "ioredis";

import { InfrastructureError } from "../errors/infrastructure-error";

export const setRedis = (
  client: Redis,
  key: string,
  value: string
): Effect.Effect<never, InfrastructureError, "OK"> =>
  Effect.tryPromise({
    try: () => client.set(key, value),
    catch: e => new InfrastructureError(e)
  });
