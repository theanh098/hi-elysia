import type { AnyHow } from "./encode";

export const databaseQueryNotFoundErrorTag: unique symbol = Symbol(
  "DatabaseQueryNotFoundTag"
);

export type DatabaseQueryNotFoundError = Readonly<{
  _tag: typeof databaseQueryNotFoundErrorTag;
  table: string;
  target: {
    column: string;
    value: string | number | boolean | null | undefined;
  };
}>;

export const databaseQueryNotFoundError = ({
  table,
  target
}: {
  table: string;
  target: {
    column: string;
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
