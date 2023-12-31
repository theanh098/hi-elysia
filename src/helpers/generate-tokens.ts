import { Chunk, Effect, pipe } from "effect";

import { InfrastructureError } from "@root/shared/errors/infrastructure-error";
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
    Chunk.empty(),
    Chunk.append(
      Effect.tryPromise({
        try: () => jwtAccess.sign({ ...user, id: user.id.toString() }),
        catch: e => new InfrastructureError(e)
      })
    ),
    Chunk.append(
      Effect.tryPromise({
        try: () => jwtRefresh.sign({ id: user.id.toString() }),
        catch: e => new InfrastructureError(e)
      })
    ),
    Effect.all,
    Effect.map(([accessToken, refreshToken]) => ({ accessToken, refreshToken }))
  );
