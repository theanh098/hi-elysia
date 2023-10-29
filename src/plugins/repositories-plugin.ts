import Elysia from "elysia";
import { pipe } from "fp-ts/lib/function";

import { getDatabase } from "@root/shared/database";
import { PostRepository } from "@root/shared/database/repositories/post-repository";
import { UserRepository } from "@root/shared/database/repositories/user-repository";

export const repositoriesPlugin = new Elysia().state(
  "repositories",
  pipe(getDatabase({ connectionString: process.env.DATABASE_URL }), db => ({
    userRepository: new UserRepository(db),
    postRepository: new PostRepository(db)
  }))
);
