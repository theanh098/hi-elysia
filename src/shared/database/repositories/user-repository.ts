import type { Database } from "..";

import type { DatabaseQueryError } from "@root/shared/errors/database-query-error";
import { databaseQueryError } from "@root/shared/errors/database-query-error";
import type { DatabaseQueryNotFoundError } from "@root/shared/errors/database-query-not-found-error";
import { databaseQueryNotFoundError } from "@root/shared/errors/database-query-not-found-error";
import type { InfrastructureError } from "@root/shared/errors/infrastructure-error";
import { infrastructureError } from "@root/shared/errors/infrastructure-error";
import type { CreateUser, User } from "@root/shared/IO/user-io";

import { user } from "../models/user-model";
import { Effect, Option, ReadonlyArray, flow, pipe } from "effect";

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
              table: "user",
              target: { column: "id", value: userId }
            })
          )
        )
      )
    );
  }

  public create({
    name,
    password
  }: CreateUser): Effect.Effect<
    never,
    DatabaseQueryError | InfrastructureError,
    User
  > {
    return pipe(
      Effect.tryPromise({
        try: () => this.db.insert(user).values({ name, password }).returning(),
        catch: databaseQueryError
      }),
      Effect.flatMap(
        flow(
          ReadonlyArray.head,
          Option.match({
            onNone: () => Effect.fail(infrastructureError("No record created")),
            onSome: user => Effect.succeed(user)
          })
        )
      )
    );
  }

  public findByName(
    name: string
  ): Effect.Effect<
    never,
    DatabaseQueryError | DatabaseQueryNotFoundError,
    User
  > {
    return pipe(
      Effect.tryPromise({
        try: () =>
          this.db.query.user.findFirst({
            where: (cols, { eq }) => eq(cols.name, name)
          }),
        catch: databaseQueryError
      }),
      Effect.flatMap(
        flow(
          Effect.fromNullable,
          Effect.mapError(() =>
            databaseQueryNotFoundError({
              table: "user",
              target: {
                column: "name",
                value: name
              }
            })
          )
        )
      )
    );
  }
}
