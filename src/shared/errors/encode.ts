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

export type AnyHow = { _tag: symbol };

export const encodeError = (err: AnyHow): never => {
  console.log("err: ", err);

  if (isInfrastructureError(err))
    throw new InfrastructureErrorAdapter(err.reason);

  if (isAuthError(err)) throw new AuthErrorAdapter(err.reason);

  if (isDatabaseQueryNotFoundError(err))
    throw new DatabaseQueryNotFoundErrorAdapter(
      `Not found records on table ${getTableConfig(err.table).name} with ${
        err.target.column.name
      } is '${err.target.value}'`
    );

  if (isDatabaseQueryError(err))
    throw new DatabaseQueryErrorAdapter("database query error");

  throw new InfrastructureErrorAdapter("Unspecific error");
};
