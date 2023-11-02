import { Effect, pipe } from "effect";

import type { UserRepository } from "@root/shared/database/repositories/user-repository";
import type { AuthError } from "@root/shared/errors/auth-error";
import { authError } from "@root/shared/errors/auth-error";
import type { DatabaseQueryError } from "@root/shared/errors/database-query-error";
import { isDatabaseQueryNotFoundError } from "@root/shared/errors/database-query-not-found-error";
import type { InfrastructureError } from "@root/shared/errors/infrastructure-error";
import { infrastructureError } from "@root/shared/errors/infrastructure-error";
import type { LoginPayload, User } from "@root/shared/IO/user-io";

export const verifyUser = ({
  name,
  password,
  userRepository
}: LoginPayload & { userRepository: UserRepository }): Effect.Effect<
  never,
  InfrastructureError | AuthError | DatabaseQueryError,
  User
> =>
  pipe(
    userRepository.findByName(name),
    Effect.bindTo("user"),
    Effect.bind("isValid", ({ user }) =>
      Effect.tryPromise({
        try: () => Bun.password.verify(password, user.password),
        catch: infrastructureError
      })
    ),
    Effect.flatMap(({ isValid, user }) =>
      pipe(
        isValid,
        Effect.if({
          onFalse: Effect.fail(authError("Wrong password")),
          onTrue: Effect.succeed(user)
        })
      )
    ),
    Effect.mapError(e =>
      isDatabaseQueryNotFoundError(e) ? authError("User not found") : e
    )
  );
