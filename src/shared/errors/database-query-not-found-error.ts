import type { AnyHow } from "./encode";

export class DatabaseQueryNotFoundErrorAdapter extends Error {
  constructor(public message: string) {
    super(message);
  }
}

export class DatabaseQueryNotFoundError implements AnyHow {
  static readonly _tag: unique symbol = Symbol("MissingEnvironmentErrorTag");

  static isBounded(err: AnyHow): err is DatabaseQueryNotFoundError {
    return DatabaseQueryNotFoundError._tag === err._tag;
  }

  constructor(
    public query: {
      table: string;
      column: string;
      value: string | number | boolean | null | undefined;
    }
  ) {}

  public _tag = DatabaseQueryNotFoundError._tag;

  public endCode(): DatabaseQueryNotFoundErrorAdapter {
    return new DatabaseQueryNotFoundErrorAdapter(
      `Not found record on table ${this.query.table} with ${this.query.column} = ${this.query.value}`
    );
  }
}
