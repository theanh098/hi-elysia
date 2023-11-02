import { AuthErrorAdapter, isAuthError } from "./auth-error";
import {
  DatabaseQueryErrorAdapter,
  isDatabaseQueryError
} from "./database-query-error";
import {
  DatabaseQueryNotFoundErrorAdapter,
  isDatabaseQueryNotFoundError
} from "./database-query-not-found-error";
import {
  InfrastructureErrorAdapter,
  isInfrastructureError
} from "./infrastructure-error";

export type AnyHow = { _tag: symbol };

export const encodeError = (err: AnyHow): never => {
  if (isInfrastructureError(err))
    throw new InfrastructureErrorAdapter(err.reason.message);

  if (isAuthError(err)) throw new AuthErrorAdapter(err.reason);

  if (isDatabaseQueryNotFoundError(err))
    throw new DatabaseQueryNotFoundErrorAdapter(
      `Not found records on table ${err.table} with ${err.target.column} is '${err.target.value}'`
    );

  if (isDatabaseQueryError(err))
    throw new DatabaseQueryErrorAdapter("database query error");

  throw new InfrastructureErrorAdapter("Unspecific error");
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
