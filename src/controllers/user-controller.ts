import { Elysia, t } from "elysia";

import { getUser } from "@root/handlers/get-user";
import { signIn } from "@root/handlers/sign-in";
import { signUp } from "@root/handlers/sign-up";
import { authPlugin } from "@root/plugins/auth-plugin";
import { redisPlugin } from "@root/plugins/redis-plugin";
import { repositoriesPlugin } from "@root/plugins/repositories-plugin";
import { signingJwtPlugin } from "@root/plugins/signing-jwt-plugin";

export const userController = new Elysia()
  .use(redisPlugin)
  .use(repositoriesPlugin)
  .group("/users", controller =>
    controller
      .group("", authGroup =>
        authGroup.use(authPlugin("access")).get(
          "/",
          ({
            store: {
              repositories: { userRepository }
            },
            claims
          }) => getUser({ userId: claims.id, userRepository })
        )
      )
      .group(
        "",
        {
          body: t.Object({
            name: t.String(),
            password: t.String()
          })
        },
        nonAuthGroup =>
          nonAuthGroup
            .use(signingJwtPlugin)
            .post(
              "/sign-up",
              ({
                store: {
                  repositories: { userRepository },
                  redis
                },
                body: { name, password },
                jwtAccess,
                jwtRefresh
              }) =>
                signUp({
                  name,
                  password,
                  userRepository,
                  jwtAccess,
                  jwtRefresh,
                  redis
                })
            )
            .post(
              "/sign-in",
              ({
                store: {
                  repositories: { userRepository }
                },
                body: { name, password },
                jwtAccess,
                jwtRefresh
              }) =>
                signIn({
                  jwtAccess,
                  jwtRefresh,
                  name,
                  password,
                  userRepository
                })
            )
      )
  );
