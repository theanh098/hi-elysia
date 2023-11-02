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
import type { CreatePost, Post } from "@root/shared/IO/post-io";

import { Effect, flow, pipe, Either } from "effect";
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
  ): TE.TaskEither<DatabaseQueryError | InfrastructureError, Post> {
    return pipe(
      TE.tryCatch(
        () => this.db.insert(post).values(newPost).returning(),
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
}
