import type { AnyHow } from "./encode";

export class MissingEnvironmentErrorAdapter extends Error {
  constructor(public message: string) {
    super(message);
  }
}

export class MissingEnvironmentError {
  static readonly _tag: unique symbol = Symbol("MissingEnvironmentErrorTag");

  static isBounded(err: AnyHow): err is MissingEnvironmentError {
    return MissingEnvironmentError._tag === err._tag;
  }

  public _tag = MissingEnvironmentError._tag;

  constructor(public config: string) {}

  public endCode(): MissingEnvironmentErrorAdapter {
    return new MissingEnvironmentErrorAdapter(
      `Missing enironment: ${this.config}`
    );
  }
}
