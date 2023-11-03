import { Effect, pipe } from "effect";

import type { LoginPayload, User } from "@root/shared/IO/user-io";
import type { UserRepository } from "@root/shared/database/repositories/user-repository";
import { AuthError } from "@root/shared/errors/auth-error";
import type { DatabaseQueryError } from "@root/shared/errors/database-query-error";
import { DatabaseQueryNotFoundError } from "@root/shared/errors/database-query-not-found-error";
import { InfrastructureError } from "@root/shared/errors/infrastructure-error";

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
        catch: e => new InfrastructureError(e)
      })
    ),
    Effect.flatMap(({ isValid, user }) =>
      pipe(
        isValid,
        Effect.if({
          onFalse: Effect.fail(new AuthError("Wrong password")),
          onTrue: Effect.succeed(user)
        })
      )
    ),
    Effect.mapError(e =>
      DatabaseQueryNotFoundError.isBounded(e)
        ? new AuthError("User not found")
        : e
    )
  );
