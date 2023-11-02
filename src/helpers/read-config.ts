import {
  MissingEnvironmentError,
  missingEnvironmentError
} from "@root/shared/errors/missing-environment-error";
import { Config, Effect, pipe } from "effect";

export const readConfig = (
  config: string
): Effect.Effect<never, MissingEnvironmentError, string> =>
  pipe(
    Config.string(config),
    Effect.config,
    Effect.mapError(() => missingEnvironmentError(config))
  );
