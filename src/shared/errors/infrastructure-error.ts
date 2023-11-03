import { toError } from "@root/helpers/to-error";

import type { AnyHow } from "./encode";

export class InfrastructureErrorAdapter extends Error {
  constructor(public message: string) {
    super(message);
  }
}

export class InfrastructureError implements AnyHow {
  static readonly _tag: unique symbol = Symbol("InfrastructureErrorTag");

  static isBounded(err: AnyHow): err is InfrastructureError {
    return InfrastructureError._tag === err._tag;
  }

  constructor(public error: unknown) {}

  public _tag = InfrastructureError._tag;

  public endCode(): InfrastructureErrorAdapter {
    return new InfrastructureErrorAdapter(
      `Infrastructure error with reason: ${toError(this.error).message}`
    );
  }
}
