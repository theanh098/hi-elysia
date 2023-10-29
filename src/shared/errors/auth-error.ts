const authErrorTag: unique symbol = Symbol("AuthErrorTag");

export type AuthError = {
  _tag: typeof authErrorTag;
  reason: string;
};

export const authError = (reason: string): AuthError => ({
  _tag: authErrorTag,
  reason
});

export const isAuthError = (error: { _tag: symbol }): error is AuthError =>
  error._tag === authErrorTag;

export class AuthErrorAdapter extends Error {
  constructor(public message: string) {
    super(message);
  }
}
