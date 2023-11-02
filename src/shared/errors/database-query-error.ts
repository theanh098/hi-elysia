import { toError } from "@root/helpers/to-error";

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
  reason: toError(e)
});

export const isDatabaseQueryError = (err: AnyHow): err is DatabaseQueryError =>
  err._tag === databaseQueryErrorTag;

export class DatabaseQueryErrorAdapter extends Error {
  constructor(public message: string) {
    super(message);
  }
}
