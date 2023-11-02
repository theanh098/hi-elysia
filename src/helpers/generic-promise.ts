import { AnyHow, encodeError } from "@root/shared/errors/encode";
import { Effect, Either } from "effect";

export const promise = <E extends AnyHow, A>(
  effect: Effect.Effect<never, E, A>
): Promise<A> =>
  Effect.runPromise(Effect.either(effect)).then(
    Either.match({ onLeft: encodeError, onRight: res => res })
  );
