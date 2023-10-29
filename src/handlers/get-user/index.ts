import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";

import type { UserRepository } from "@root/shared/database/repositories/user-repository";
import { encodeError } from "@root/shared/errors/encode";
import type { User } from "@root/shared/IO/user-io";

export const getUser = ({
  userId,
  userRepository
}: {
  userId: number;
  userRepository: UserRepository;
}): Promise<Omit<User, "password">> =>
  pipe(
    userRepository.findById(userId),
    TE.match(encodeError, user => ({
      name: user.name,
      id: user.id
    }))
  )();
