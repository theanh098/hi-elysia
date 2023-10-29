import * as E from "fp-ts/Either";

import type { AnyHow } from "./encode";

export const databaseQueryErrorTag: unique symbol = Symbol(
  "DatabaseQueryErrorTag"
);

export type DatabaseQueryError = Readonly<{
  _tag: typeof databaseQueryErrorTag;
  reason: Error;
}>;

export const databaseQueryError = (e: unknown): DatabaseQueryError => ({
  _tag: databaseQueryErrorTag,
  reason: E.toError(e)
});

export const isDatabaseQueryError = (err: AnyHow): err is DatabaseQueryError =>
  err._tag === databaseQueryErrorTag;
