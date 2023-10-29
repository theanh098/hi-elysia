import * as TE from "fp-ts/TaskEither";
import type { Redis } from "ioredis";

import type { InfrastructureError } from "../errors/infrastructure-error";
import { infrastructureError } from "../errors/infrastructure-error";

export const setRedis = (
  client: Redis,
  key: string,
  value: string
): TE.TaskEither<InfrastructureError, "OK"> =>
  TE.tryCatch(
    () => client.set(key, value),
    e => infrastructureError(JSON.stringify(e))
  );
