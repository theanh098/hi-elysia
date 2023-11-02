import type { UserRepository } from "@root/shared/database/repositories/user-repository";
import type { AuthError } from "@root/shared/errors/auth-error";
import { authError } from "@root/shared/errors/auth-error";
import type { DatabaseQueryError } from "@root/shared/errors/database-query-error";
import { isDatabaseQueryNotFoundError } from "@root/shared/errors/database-query-not-found-error";
import type { InfrastructureError } from "@root/shared/errors/infrastructure-error";
import { infrastructureError } from "@root/shared/errors/infrastructure-error";
import type { LoginPayload, User } from "@root/shared/IO/user-io";
import { Effect, pipe, Boolean, Random } from "effect";

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
    Effect.mapError(e => {
      let r = pipe(
        e,
        isDatabaseQueryNotFoundError,
        Boolean.match({
          onFalse: () => e,
          onTrue: () => authError("User not found")
        })
      );
      return isDatabaseQueryNotFoundError(e) ? authError("User not found") : e;
    })
  );
