import * as O from "fp-ts/Option";
import * as RA from "fp-ts/ReadonlyArray";
import * as TE from "fp-ts/TaskEither";

import type { Database } from "..";

import type { DatabaseQueryError } from "@root/shared/errors/database-query-error";
import { databaseQueryError } from "@root/shared/errors/database-query-error";
import type { DatabaseQueryNotFoundError } from "@root/shared/errors/database-query-not-found-error";
import { databaseQueryNotFoundError } from "@root/shared/errors/database-query-not-found-error";
import type { InfrastructureError } from "@root/shared/errors/infrastructure-error";
import { infrastructureError } from "@root/shared/errors/infrastructure-error";
import type { CreateUser, User } from "@root/shared/IO/user-io";

import { user } from "../models/user-model";
import { Effect, Either, flow, pipe } from "effect";

export class UserRepository {
  constructor(private db: Database) {}

  public findById(
    userId: number
  ): Effect.Effect<
    never,
    DatabaseQueryError | DatabaseQueryNotFoundError,
    User
  > {
    return pipe(
      Effect.tryPromise({
        try: () =>
          this.db.query.user.findFirst({
            where: ({ id }, { eq }) => eq(id, userId)
          }),
        catch: databaseQueryError
      }),
      Effect.flatMap(
        flow(
          Effect.fromNullable,
          Effect.mapError(e =>
            databaseQueryNotFoundError({
              table: user,
              target: { column: user.id, value: userId }
            })
          )
        )
      )
    );
  }

  public create({
    name,
    password
  }: CreateUser): TE.TaskEither<
    DatabaseQueryError | InfrastructureError,
    User
  > {
    return pipe(
      TE.tryCatch(
        () => this.db.insert(user).values({ name, password }).returning(),
        databaseQueryError
      ),
      TE.chainW(
        flow(
          RA.head,
          O.matchW(
            () => TE.left(infrastructureError("No record created")),
            user => TE.of(user)
          )
        )
      )
    );
  }

  public findByName(
    name: string
  ): TE.TaskEither<DatabaseQueryError | DatabaseQueryNotFoundError, User> {
    return pipe(
      TE.tryCatch(
        () =>
          this.db.query.user.findFirst({
            where: (cols, { eq }) => eq(cols.name, name)
          }),
        databaseQueryError
      ),
      TE.chainW(
        TE.fromNullable(
          databaseQueryNotFoundError({
            table: user,
            target: {
              column: user.name,
              value: name
            }
          })
        )
      )
    );
  }
}
