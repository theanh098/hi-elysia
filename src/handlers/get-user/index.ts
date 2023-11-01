import { pipe } from "fp-ts/function";

import type { UserRepository } from "@root/shared/database/repositories/user-repository";
import { encodeError } from "@root/shared/errors/encode";
import type { User } from "@root/shared/IO/user-io";
import { Effect } from "effect";

export const getUser = ({
  userId,
  userRepository
}: {
  userId: number;
  userRepository: UserRepository;
}): Promise<Omit<User, "password">> =>
  pipe(
    userRepository.findById(userId),
    Effect.map(user => ({ id: user.id, name: user.name })),
    Effect.match({ onFailure: e => encodeError(e), onSuccess: m => m }),
    Effect.runPromise
  );
