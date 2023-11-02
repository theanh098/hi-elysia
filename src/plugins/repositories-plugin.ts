import { Effect, pipe } from "effect";
import Elysia from "elysia";

import { readConfig } from "@root/helpers/read-config";
import { getDatabase } from "@root/shared/database";
import { PostRepository } from "@root/shared/database/repositories/post-repository";
import { UserRepository } from "@root/shared/database/repositories/user-repository";

export const repositoriesPlugin = new Elysia().state(
  "repositories",
  pipe(
    readConfig("DATABASE_URL"),
    Effect.runSync,
    dbUrl => getDatabase({ connectionString: dbUrl }),
    db => ({
      userRepository: new UserRepository(db),
      postRepository: new PostRepository(db)
    })
  )
);
