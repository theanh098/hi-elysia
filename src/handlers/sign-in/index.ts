import { Effect, pipe } from "effect";

import { genericPromise } from "@root/helpers/generic-promise";
import type { UserRepository } from "@root/shared/database/repositories/user-repository";
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
  genericPromise(
    pipe(
      verifyUser({ name, password, userRepository }),
      Effect.flatMap(user => generateTokens({ jwtAccess, jwtRefresh, user }))
    )
  );
