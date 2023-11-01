import { Elysia, t } from "elysia";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";

import { authPlugin } from "@root/plugins/auth-plugin";
import { repositoriesPlugin } from "@root/plugins/repositories-plugin";
import { encodeError } from "@root/shared/errors/encode";
import { getPost } from "@root/handlers/get-post";

export const postController = new Elysia()
  .use(repositoriesPlugin)
  .group("/posts", controller =>
    controller
      .group("", nonAuthGroup =>
        nonAuthGroup.get(
          "/:id",
          ({
            store: {
              repositories: { postRepository }
            },
            params: { id }
          }) => getPost({ id, postRepository }),
          {
            params: t.Object({
              id: t.Numeric()
            })
          }
        )
      )
      .group("", authGroup =>
        authGroup.use(authPlugin("access")).post(
          "/",
          ({
            store: {
              repositories: { postRepository }
            },
            claims
          }) => {}
        )
      )
  );
