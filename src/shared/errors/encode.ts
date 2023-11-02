import { getTableConfig } from "drizzle-orm/pg-core";

import { AuthErrorAdapter, isAuthError } from "./auth-error";
import {
  DatabaseQueryNotFoundErrorAdapter,
  isDatabaseQueryNotFoundError
} from "./database-query-not-found-error";
import {
  InfrastructureErrorAdapter,
  isInfrastructureError
} from "./infrastructure-error";
import {
  DatabaseQueryErrorAdapter,
  isDatabaseQueryError
} from "./database-query-error";
import { FiberFailure, isFiberFailure } from "effect/Runtime";
import { Effect, pipe } from "effect";

export type AnyHow = { _tag: symbol };

export const encodeError = (err: AnyHow): never => {
  console.log("err: ", err);

  if (isInfrastructureError(err))
    throw new InfrastructureErrorAdapter(err.reason);

  if (isAuthError(err)) throw new AuthErrorAdapter(err.reason);

  if (isDatabaseQueryNotFoundError(err))
    throw new DatabaseQueryNotFoundErrorAdapter(
      `Not found records on table ${err.table} with ${err.target.column} is '${err.target.value}'`
    );

  if (isDatabaseQueryError(err))
    throw new DatabaseQueryErrorAdapter("database query error");

  throw new InfrastructureErrorAdapter("Unspecific error");
};

export const encodeError2 = (err: AnyHow) => {
  if (isInfrastructureError(err))
    return new InfrastructureErrorAdapter(err.reason);

  if (isAuthError(err)) return new AuthErrorAdapter(err.reason);

  if (isDatabaseQueryNotFoundError(err))
    return new DatabaseQueryNotFoundErrorAdapter(
      `Not found records on table ${err.table} with ${err.target.column} is '${err.target.value}'`
    );

  if (isDatabaseQueryError(err))
    return new DatabaseQueryErrorAdapter("database query error");

  return new InfrastructureErrorAdapter("Unspecific error");
};

// export const getError = (error: FiberFailure): AnyHow =>
//   pipe(
//     Effect.try({
//       catch: () => new Error("Unspecific error"),
//       try: () => error.toJSON() as { cause: { failure: AnyHow } }
//     }),
//     Effect.map(e => {
//       console.log("e.cause.failure: ", e.cause.failure);
//       return e.cause.failure;
//     }),
//     Effect.runSync
//   );
