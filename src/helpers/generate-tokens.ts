import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";

import type { InfrastructureError } from "@root/shared/errors/infrastructure-error";
import { infrastructureError } from "@root/shared/errors/infrastructure-error";
import type { User } from "@root/shared/IO/user-io";
import type { JWT } from "@root/types/jwt";

export const generateTokens = ({
  jwtAccess,
  jwtRefresh,
  user
}: {
  jwtAccess: JWT;
  jwtRefresh: JWT;
  user: User;
}): TE.TaskEither<
  InfrastructureError,
  { accessToken: string; refreshToken: string }
> =>
  pipe(
    TE.tryCatch(
      () =>
        Promise.all([
          jwtAccess.sign({ ...user, id: user.id.toString() }),
          jwtRefresh.sign({ id: user.id.toString() })
        ]),
      e => infrastructureError(JSON.stringify(e))
    ),
    TE.map(([accessToken, refreshToken]) => ({ accessToken, refreshToken }))
  );
