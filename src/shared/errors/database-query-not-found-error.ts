import type { PgColumn } from "drizzle-orm/pg-core";

import type { ElysiaTable } from "@root/shared/database";

import type { AnyHow } from "./encode";

export const databaseQueryNotFoundErrorTag: unique symbol = Symbol(
  "DatabaseQueryNotFoundTag"
);

export type DatabaseQueryNotFoundError = Readonly<{
  _tag: typeof databaseQueryNotFoundErrorTag;
  table: ElysiaTable;
  target: {
    column: PgColumn;
    value: string | number | boolean | null | undefined;
  };
}>;

export const databaseQueryNotFoundError = ({
  table,
  target
}: {
  table: ElysiaTable;
  target: {
    column: PgColumn;
    value: string | number | boolean | null | undefined;
  };
}): DatabaseQueryNotFoundError => ({
  _tag: databaseQueryNotFoundErrorTag,
  table,
  target
});

export const isDatabaseQueryNotFoundError = (
  err: AnyHow
): err is DatabaseQueryNotFoundError =>
  err._tag === databaseQueryNotFoundErrorTag;

export class DatabaseQueryNotFoundErrorAdapter extends Error {
  constructor(public message: string) {
    super(message);
  }
}
