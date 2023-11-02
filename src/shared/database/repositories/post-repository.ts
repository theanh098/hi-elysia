import type { Database } from "..";

import type { DatabaseQueryError } from "@root/shared/errors/database-query-error";
import { databaseQueryError } from "@root/shared/errors/database-query-error";
import type { DatabaseQueryNotFoundError } from "@root/shared/errors/database-query-not-found-error";
import { databaseQueryNotFoundError } from "@root/shared/errors/database-query-not-found-error";
import type { InfrastructureError } from "@root/shared/errors/infrastructure-error";
import { infrastructureError } from "@root/shared/errors/infrastructure-error";
import type { CreatePost, Post } from "@root/shared/IO/post-io";

import { Effect, flow, pipe, Option, ReadonlyArray } from "effect";
import { post } from "../models/post-model";

export class PostRepository {
  constructor(private db: Database) {}

  public findById(
    postId: number
  ): Effect.Effect<
    never,
    DatabaseQueryError | DatabaseQueryNotFoundError,
    Post
  > {
    return pipe(
      Effect.tryPromise({
        try: () =>
          this.db.query.post.findFirst({
            where: ({ id }, { eq }) => eq(id, postId)
          }),
        catch: e => databaseQueryError(e)
      }),
      Effect.flatMap(
        flow(
          Effect.fromNullable,
          Effect.mapError(() =>
            databaseQueryNotFoundError({
              table: "post",
              target: { column: "id", value: postId }
            })
          )
        )
      )
    );
  }

  public create(
    newPost: CreatePost
  ): Effect.Effect<never, DatabaseQueryError | InfrastructureError, Post> {
    return pipe(
      Effect.tryPromise({
        try: () => this.db.insert(post).values(newPost).returning(),
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
}
