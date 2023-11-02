import { Post } from "@root/shared/IO/post-io";
import { PostRepository } from "@root/shared/database/repositories/post-repository";
import { AnyHow, encodeError } from "@root/shared/errors/encode";
import { Effect, Either, pipe } from "effect";

export const getPost = ({
  id,
  postRepository
}: {
  id: number;
  postRepository: PostRepository;
}): Promise<Post> => promise(postRepository.findById(id));

export const promise = <E extends AnyHow, A>(
  effect: Effect.Effect<never, E, A>
): Promise<A> =>
  Effect.runPromise(Effect.either(effect)).then(
    Either.match({ onLeft: encodeError, onRight: res => res })
  );
// promise.then(Either.match({ onLeft: encodeError, onRight: res => res }));
