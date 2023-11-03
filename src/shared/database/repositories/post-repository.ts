import type { Database } from "..";

import { DatabaseQueryError } from "@root/shared/errors/database-query-error";
import { DatabaseQueryNotFoundError } from "@root/shared/errors/database-query-not-found-error";
import { InfrastructureError } from "@root/shared/errors/infrastructure-error";
import type { CreatePost, Post } from "@root/shared/IO/post-io";

import { Chunk, Effect, flow, Option, pipe } from "effect";

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
        catch: e => new DatabaseQueryError(e)
      }),
      Effect.flatMap(
        flow(
          Effect.fromNullable,
          Effect.mapError(
            () =>
              new DatabaseQueryNotFoundError({
                table: "post",
                column: "id",
                value: postId
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
        catch: e => new DatabaseQueryError(e)
      }),
      Effect.flatMap(
        flow(
          Chunk.fromIterable,
          Chunk.head,
          Option.match({
            onNone: () =>
              Effect.fail(new InfrastructureError("No record created")),
            onSome: user => Effect.succeed(user)
          })
        )
      )
    );
  }
}
