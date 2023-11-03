import { Config, Effect, pipe } from "effect";

import { MissingEnvironmentError } from "@root/shared/errors/missing-environment-error";

export const readConfig = (
  config: string
): Effect.Effect<never, MissingEnvironmentError, string> =>
  pipe(
    Config.string(config),
    Effect.config,
    Effect.mapError(() => new MissingEnvironmentError(config))
  );
