import { Post } from "@root/shared/IO/post-io";
import { PostRepository } from "@root/shared/database/repositories/post-repository";
import { encodeError } from "@root/shared/errors/encode";
import { Effect, pipe } from "effect";

export const getPost = ({
  id,
  postRepository
}: {
  id: number;
  postRepository: PostRepository;
}): Promise<Post> =>
  pipe(
    postRepository.findById(id),
    Effect.orDieWith(encodeError),
    Effect.runPromise
  );
