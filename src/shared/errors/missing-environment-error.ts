import type { AnyHow } from "./encode";

export class MissingEnvironmentErrorAdapter extends Error {
  constructor(public message: string) {
    super(message);
  }
}

export class MissingEnvironmentError implements AnyHow {
  static readonly _tag: unique symbol = Symbol("MissingEnvironmentErrorTag");

  static isBounded(err: AnyHow): err is MissingEnvironmentError {
    return MissingEnvironmentError._tag === err._tag;
  }

  constructor(public config: string) {}

  public _tag = MissingEnvironmentError._tag;

  public endCode(): MissingEnvironmentErrorAdapter {
    return new MissingEnvironmentErrorAdapter(
      `Missing environment: ${this.config}`
    );
  }
}
