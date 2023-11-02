import type { UserRepository } from "@root/shared/database/repositories/user-repository";
import { encodeError } from "@root/shared/errors/encode";
import type { LoginPayload } from "@root/shared/IO/user-io";
import type { JWT } from "@root/types/jwt";

import { generateTokens } from "../../helpers/generate-tokens";
import { verifyUser } from "./verify-user";
import { pipe } from "effect";
import { promise } from "@root/helpers/generic-promise";

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
  promise(
    pipe(
      verifyUser({ name, password, userRepository }),
      TE.chainW(user => generateTokens({ jwtAccess, jwtRefresh, user })),
      TE.match(encodeError, tokens => tokens)
    )
  );
