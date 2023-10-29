import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";

import type { UserRepository } from "@root/shared/database/repositories/user-repository";
import { encodeError } from "@root/shared/errors/encode";
import type { LoginPayload } from "@root/shared/IO/user-io";
import type { JWT } from "@root/types/jwt";

import { generateTokens } from "../../helpers/generate-tokens";
import { verifyUser } from "./verify-user";

export const signIn = ({
  name,
  password,
  userRepository,
  jwtAccess,
  jwtRefresh
}: LoginPayload & {
  userRepository: UserRepository;
  jwtRefresh: JWT;
  jwtAccess: JWT;
}): Promise<{ accessToken: string; refreshToken: string }> =>
  pipe(
    verifyUser({ name, password, userRepository }),
    TE.chainW(user => generateTokens({ jwtAccess, jwtRefresh, user })),
    TE.match(encodeError, tokens => tokens)
  )();
