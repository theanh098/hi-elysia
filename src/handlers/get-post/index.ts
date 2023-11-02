import { genericPromise } from "@root/helpers/generic-promise";
import type { PostRepository } from "@root/shared/database/repositories/post-repository";
import type { Post } from "@root/shared/IO/post-io";

export const getPost = ({
  id,
  postRepository
}: {
  id: number;
  postRepository: PostRepository;
}): Promise<Post> => genericPromise(postRepository.findById(id));
