import { promise } from "@root/helpers/generic-promise";
import { Post } from "@root/shared/IO/post-io";
import { PostRepository } from "@root/shared/database/repositories/post-repository";

export const getPost = ({
  id,
  postRepository
}: {
  id: number;
  postRepository: PostRepository;
}): Promise<Post> => promise(postRepository.findById(id));
