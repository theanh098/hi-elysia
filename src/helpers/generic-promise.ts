import { Effect, Either } from "effect";

import type { AnyHow } from "@root/shared/errors/encode";
import { encodeError } from "@root/shared/errors/encode";

export const genericPromise = <E extends AnyHow, A>(
  effect: Effect.Effect<never, E, A>
): Promise<A> =>
  Effect.runPromise(Effect.either(effect)).then(
    Either.match({ onLeft: encodeError, onRight: res => res })
  );
