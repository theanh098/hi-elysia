import { Effect, pipe } from "effect";

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
    Effect.map(user => ({ id: user.id, name: user.name })),
    Effect.match({ onFailure: e => encodeError(e), onSuccess: m => m }),
    Effect.runPromise
  );
