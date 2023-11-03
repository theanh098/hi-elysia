import type { Database } from "..";

import { DatabaseQueryError } from "@root/shared/errors/database-query-error";
import { DatabaseQueryNotFoundError } from "@root/shared/errors/database-query-not-found-error";
import { InfrastructureError } from "@root/shared/errors/infrastructure-error";
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
        catch: e => new DatabaseQueryError(e)
      }),
      Effect.flatMap(
        flow(
          Effect.fromNullable,
          Effect.mapError(
            () =>
              new DatabaseQueryNotFoundError({
                table: "user",
                column: "id",
                value: userId
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
        catch: e => new DatabaseQueryError(e)
      }),
      Effect.flatMap(
        flow(
          ReadonlyArray.head,
          Option.match({
            onNone: () =>
              Effect.fail(new InfrastructureError("No record created")),
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
        catch: e => new DatabaseQueryError(e)
      }),
      Effect.flatMap(
        flow(
          Effect.fromNullable,
          Effect.mapError(
            () =>
              new DatabaseQueryNotFoundError({
                table: "user",
                column: "name",
                value: name
              })
          )
        )
      )
    );
  }
}
