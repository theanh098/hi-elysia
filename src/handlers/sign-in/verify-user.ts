import * as B from "fp-ts/boolean";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";

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
}: LoginPayload & { userRepository: UserRepository }): TE.TaskEither<
  InfrastructureError | AuthError | DatabaseQueryError,
  User
> =>
  pipe(
    userRepository.findByName(name),
    TE.bindTo("user"),
    TE.bindW("isValid", ({ user }) =>
      TE.tryCatch(
        () => Bun.password.verify(password, user.password),
        e => infrastructureError(JSON.stringify(e))
      )
    ),
    TE.chainW(({ isValid, user }) =>
      pipe(
        isValid,
        B.foldW(
          () => TE.left(authError("Wrong password")),
          () => TE.of(user)
        )
      )
    ),
    TE.mapError(e =>
      isDatabaseQueryNotFoundError(e) ? authError("User not found") : e
    )
  );
