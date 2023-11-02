import { Effect, pipe } from "effect";

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
}): Effect.Effect<
  never,
  InfrastructureError,
  { accessToken: string; refreshToken: string }
> =>
  pipe(
    Effect.tryPromise({
      try: () =>
        Promise.all([
          jwtAccess.sign({ ...user, id: user.id.toString() }),
          jwtRefresh.sign({ id: user.id.toString() })
        ]),
      catch: e => infrastructureError(JSON.stringify(e))
    }),
    Effect.map(([accessToken, refreshToken]) => ({ accessToken, refreshToken }))
  );
