import { Effect, pipe } from "effect";
import type { Redis } from "ioredis";

import { genericPromise } from "@root/helpers/generic-promise";
import type { UserRepository } from "@root/shared/database/repositories/user-repository";
import type { CreateUser } from "@root/shared/IO/user-io";
import { setRedis } from "@root/shared/redis/set";
import type { JWT } from "@root/types/jwt";

import { generateTokens } from "../../helpers/generate-tokens";
import { InfrastructureError } from "@root/shared/errors/infrastructure-error";

export const signUp = ({
  name,
  password,
  userRepository,
  jwtAccess,
  jwtRefresh,
  redis
}: CreateUser & {
  userRepository: UserRepository;
  jwtAccess: JWT;
  jwtRefresh: JWT;
  redis: Redis;
}): Promise<{ accessToken: string; refreshToken: string }> =>
  genericPromise(
    pipe(
      Effect.tryPromise({
        try: () =>
          Bun.password.hash(password, { cost: 8, algorithm: "bcrypt" }),
        catch: e => new InfrastructureError(e)
      }),
      Effect.bind("user", hashPassword =>
        userRepository.create({ name, password: hashPassword })
      ),
      Effect.bind("tokens", ({ user }) =>
        generateTokens({ jwtAccess, jwtRefresh, user })
      ),
      Effect.tap(({ user, tokens }) =>
        pipe(
          setRedis(redis, `refresh_on_${user.id}`, tokens.refreshToken),
          Effect.ignore
        )
      ),
      Effect.map(({ tokens }) => tokens)
    )
  );
