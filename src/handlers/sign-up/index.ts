import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import type { Redis } from "ioredis";

import type { UserRepository } from "@root/shared/database/repositories/user-repository";
import { encodeError } from "@root/shared/errors/encode";
import { infrastructureError } from "@root/shared/errors/infrastructure-error";
import type { CreateUser } from "@root/shared/IO/user-io";
import type { JWT } from "@root/types/jwt";

import { generateTokens } from "../../helpers/generate-tokens";

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
  pipe(
    TE.tryCatch(
      () => Bun.password.hash(password, { cost: 8, algorithm: "bcrypt" }),
      e => infrastructureError(JSON.stringify(e))
    ),
    TE.bindW("user", hashPassword =>
      userRepository.create({ name, password: hashPassword })
    ),
    TE.bindW("tokens", ({ user }) =>
      generateTokens({ jwtAccess, jwtRefresh, user })
    ),
    TE.chainFirstIOK(
      ({ user, tokens }) =>
        () =>
          redis.set(`refresh_on_${user.id}`, tokens.refreshToken)
    ),
    TE.match(encodeError, rs => rs.tokens)
  )();
