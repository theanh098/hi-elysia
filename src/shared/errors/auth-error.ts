import type { AnyHow } from "./encode";

export class AuthErrorAdapter extends Error {
  constructor(public message: string) {
    super(message);
  }
}

export class AuthError implements AnyHow {
  static readonly _tag: unique symbol = Symbol("AuthErrorTag");

  static isBounded(err: AnyHow): err is AuthError {
    return AuthError._tag === err._tag;
  }

  constructor(public reason?: string) {}

  public _tag = AuthError._tag;

  public endCode(): AuthErrorAdapter {
    return new AuthErrorAdapter(`UnAuthorized: ${this.reason}`);
  }
}
