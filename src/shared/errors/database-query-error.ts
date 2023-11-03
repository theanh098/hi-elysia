import { toError } from "@root/helpers/to-error";

import type { AnyHow } from "./encode";

export class DatabaseQueryErrorAdapter extends Error {
  constructor(public message: string) {
    super(message);
  }
}

export class DatabaseQueryError implements AnyHow {
  static readonly _tag: unique symbol = Symbol("MissingEnvironmentErrorTag");

  static isBounded(err: AnyHow): err is DatabaseQueryError {
    return DatabaseQueryError._tag === err._tag;
  }

  constructor(public error: unknown) {}

  public _tag = DatabaseQueryError._tag;

  public endCode(): DatabaseQueryErrorAdapter {
    return new DatabaseQueryErrorAdapter(
      `Database query error with reason ${toError(this.error).message}`
    );
  }
}
